#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, token, Address, Env, String, Vec
};

mod test;

#[derive(Clone)]
#[contracttype]
pub struct Tip {
    pub id: u64,
    pub from: Address,
    pub to: Address,
    pub amount: i128,
    pub message: String,
    pub timestamp: u64,
    pub claimed: bool,
}

#[derive(Clone)]
#[contracttype]
pub struct TipStats {
    pub total_tips: u64,
    pub total_amount: i128,
    pub unique_tippers: u64,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Tip(u64),
    TipCounter,
    UserTips(Address),
    Stats,
    Admin,
}

#[contract]
pub struct TipJarContract;

#[contractimpl]
impl TipJarContract {
    /// Initialize the contract with an admin
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Contract already initialized");
        }
        
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TipCounter, &0u64);
        
        let initial_stats = TipStats {
            total_tips: 0,
            total_amount: 0,
            unique_tippers: 0,
        };
        env.storage().instance().set(&DataKey::Stats, &initial_stats);
    }

    /// Send a tip to another user
    pub fn send_tip(
        env: Env,
        from: Address,
        to: Address,
        token_address: Address,
        amount: i128,
        message: String,
    ) -> u64 {
        from.require_auth();
        
        if amount <= 0 {
            panic!("Amount must be positive");
        }

        // Transfer tokens from sender to contract
        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&from, &env.current_contract_address(), &amount);

        // Get next tip ID
        let tip_id: u64 = env.storage().instance()
            .get(&DataKey::TipCounter)
            .unwrap_or(0);
        
        let new_tip_id = tip_id + 1;
        env.storage().instance().set(&DataKey::TipCounter, &new_tip_id);

        // Create tip record
        let tip = Tip {
            id: new_tip_id,
            from: from.clone(),
            to: to.clone(),
            amount,
            message,
            timestamp: env.ledger().timestamp(),
            claimed: false,
        };

        // Store tip
        env.storage().persistent().set(&DataKey::Tip(new_tip_id), &tip);

        // Update user's tip list
        let mut user_tips: Vec<u64> = env.storage().persistent()
            .get(&DataKey::UserTips(to.clone()))
            .unwrap_or(Vec::new(&env));
        user_tips.push_back(new_tip_id);
        env.storage().persistent().set(&DataKey::UserTips(to), &user_tips);

        // Update stats
        let mut stats: TipStats = env.storage().instance()
            .get(&DataKey::Stats)
            .unwrap_or(TipStats {
                total_tips: 0,
                total_amount: 0,
                unique_tippers: 0,
            });
        
        stats.total_tips += 1;
        stats.total_amount += amount;
        env.storage().instance().set(&DataKey::Stats, &stats);

        // Emit event
        env.events().publish(
            ("tip_sent",),
            (new_tip_id, from, to, amount)
        );

        new_tip_id
    }

    /// Claim a tip
    pub fn claim_tip(env: Env, tip_id: u64, token_address: Address) {
        let mut tip: Tip = env.storage().persistent()
            .get(&DataKey::Tip(tip_id))
            .expect("Tip not found");

        if tip.claimed {
            panic!("Tip already claimed");
        }

        tip.to.require_auth();

        // Transfer tokens from contract to recipient
        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&env.current_contract_address(), &tip.to, &tip.amount);

        // Mark as claimed
        tip.claimed = true;
        env.storage().persistent().set(&DataKey::Tip(tip_id), &tip);

        // Emit event
        env.events().publish(
            ("tip_claimed",),
            (tip_id, tip.to.clone(), tip.amount)
        );
    }

    /// Get tip details
    pub fn get_tip(env: Env, tip_id: u64) -> Option<Tip> {
        env.storage().persistent().get(&DataKey::Tip(tip_id))
    }

    /// Get user's received tips
    pub fn get_user_tips(env: Env, user: Address) -> Vec<u64> {
        env.storage().persistent()
            .get(&DataKey::UserTips(user))
            .unwrap_or(Vec::new(&env))
    }

    /// Get contract statistics
    pub fn get_stats(env: Env) -> TipStats {
        env.storage().instance()
            .get(&DataKey::Stats)
            .unwrap_or(TipStats {
                total_tips: 0,
                total_amount: 0,
                unique_tippers: 0,
            })
    }

    /// Batch claim multiple tips
    pub fn batch_claim_tips(env: Env, tip_ids: Vec<u64>, token_address: Address) {
        let token_client = token::Client::new(&env, &token_address);
        let mut total_amount = 0i128;
        let mut claimer: Option<Address> = None;

        for tip_id in tip_ids.iter() {
            let mut tip: Tip = env.storage().persistent()
                .get(&DataKey::Tip(*tip_id))
                .expect("Tip not found");

            if tip.claimed {
                continue; // Skip already claimed tips
            }

            // Ensure all tips belong to the same user
            if let Some(ref addr) = claimer {
                if *addr != tip.to {
                    panic!("All tips must belong to the same user");
                }
            } else {
                claimer = Some(tip.to.clone());
                tip.to.require_auth();
            }

            total_amount += tip.amount;
            tip.claimed = true;
            env.storage().persistent().set(&DataKey::Tip(*tip_id), &tip);
        }

        if total_amount > 0 && claimer.is_some() {
            token_client.transfer(
                &env.current_contract_address(),
                &claimer.unwrap(),
                &total_amount
            );
        }
    }

    /// Emergency withdraw (admin only)
    pub fn emergency_withdraw(
        env: Env,
        token_address: Address,
        amount: i128,
        to: Address
    ) {
        let admin: Address = env.storage().instance()
            .get(&DataKey::Admin)
            .expect("Admin not set");
        
        admin.require_auth();

        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&env.current_contract_address(), &to, &amount);
    }
}