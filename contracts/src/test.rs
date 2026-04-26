#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation},
    token, Address, Env, IntoVal, String,
};

fn create_token_contract<'a>(e: &Env, admin: &Address) -> token::Client<'a> {
    token::Client::new(e, &e.register_stellar_asset_contract(admin.clone()))
}

#[test]
fn test_initialize() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let contract_id = env.register_contract(None, TipJarContract);
    let client = TipJarContractClient::new(&env, &contract_id);

    client.initialize(&admin);

    let stats = client.get_stats();
    assert_eq!(stats.total_tips, 0);
    assert_eq!(stats.total_amount, 0);
}

#[test]
fn test_send_and_claim_tip() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let tipper = Address::generate(&env);
    let recipient = Address::generate(&env);

    // Create token contract
    let token = create_token_contract(&env, &admin);
    token.mint(&tipper, &1000);

    // Create tip contract
    let contract_id = env.register_contract(None, TipJarContract);
    let client = TipJarContractClient::new(&env, &contract_id);

    client.initialize(&admin);

    // Send tip
    let tip_id = client.send_tip(
        &tipper,
        &recipient,
        &token.address,
        &100,
        &String::from_str(&env, "Great work!")
    );

    assert_eq!(tip_id, 1);

    // Check tip details
    let tip = client.get_tip(&tip_id).unwrap();
    assert_eq!(tip.from, tipper);
    assert_eq!(tip.to, recipient);
    assert_eq!(tip.amount, 100);
    assert_eq!(tip.claimed, false);

    // Check stats
    let stats = client.get_stats();
    assert_eq!(stats.total_tips, 1);
    assert_eq!(stats.total_amount, 100);

    // Claim tip
    client.claim_tip(&tip_id, &token.address);

    // Check tip is claimed
    let tip = client.get_tip(&tip_id).unwrap();
    assert_eq!(tip.claimed, true);

    // Check recipient balance
    assert_eq!(token.balance(&recipient), 100);
}

#[test]
fn test_batch_claim_tips() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let tipper1 = Address::generate(&env);
    let tipper2 = Address::generate(&env);
    let recipient = Address::generate(&env);

    // Create token contract
    let token = create_token_contract(&env, &admin);
    token.mint(&tipper1, &1000);
    token.mint(&tipper2, &1000);

    // Create tip contract
    let contract_id = env.register_contract(None, TipJarContract);
    let client = TipJarContractClient::new(&env, &contract_id);

    client.initialize(&admin);

    // Send multiple tips
    let tip_id1 = client.send_tip(
        &tipper1,
        &recipient,
        &token.address,
        &100,
        &String::from_str(&env, "Tip 1")
    );

    let tip_id2 = client.send_tip(
        &tipper2,
        &recipient,
        &token.address,
        &200,
        &String::from_str(&env, "Tip 2")
    );

    // Batch claim
    let tip_ids = soroban_sdk::vec![&env, tip_id1, tip_id2];
    client.batch_claim_tips(&tip_ids, &token.address);

    // Check recipient balance
    assert_eq!(token.balance(&recipient), 300);

    // Check tips are claimed
    let tip1 = client.get_tip(&tip_id1).unwrap();
    let tip2 = client.get_tip(&tip_id2).unwrap();
    assert_eq!(tip1.claimed, true);
    assert_eq!(tip2.claimed, true);
}

#[test]
#[should_panic(expected = "Amount must be positive")]
fn test_send_tip_zero_amount() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let tipper = Address::generate(&env);
    let recipient = Address::generate(&env);

    let token = create_token_contract(&env, &admin);
    let contract_id = env.register_contract(None, TipJarContract);
    let client = TipJarContractClient::new(&env, &contract_id);

    client.initialize(&admin);

    client.send_tip(
        &tipper,
        &recipient,
        &token.address,
        &0,
        &String::from_str(&env, "Invalid tip")
    );
}

#[test]
#[should_panic(expected = "Tip already claimed")]
fn test_double_claim_tip() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let tipper = Address::generate(&env);
    let recipient = Address::generate(&env);

    let token = create_token_contract(&env, &admin);
    token.mint(&tipper, &1000);

    let contract_id = env.register_contract(None, TipJarContract);
    let client = TipJarContractClient::new(&env, &contract_id);

    client.initialize(&admin);

    let tip_id = client.send_tip(
        &tipper,
        &recipient,
        &token.address,
        &100,
        &String::from_str(&env, "Test tip")
    );

    // First claim should work
    client.claim_tip(&tip_id, &token.address);

    // Second claim should panic
    client.claim_tip(&tip_id, &token.address);
}