import { Address } from '@graphprotocol/graph-ts'
import { Stake, Unstake } from '../generated/schema'

import {  StakeOHMCall, UnstakeOHMCall  } from '../generated/OlympusStaking/OlympusStaking'
import { toDecimal } from "./utils/Decimals"
import { loadOrCreateOHMie } from "./utils/OHMie"
import { loadOrCreateTransaction } from "./utils/Transactions"

export function handleStake(call: StakeOHMCall): void {
    let ohmie = loadOrCreateOHMie(call.from as Address)
    let transaction = loadOrCreateTransaction(call.transaction, call.block)
    let value = toDecimal(call.inputs.amountToStake_, 9)

    ohmie.stakedOHMs = ohmie.stakedOHMs.plus(value)
    ohmie.save()

    let stake = new Stake(transaction.id)
    stake.transaction = transaction.id
    stake.ohmie = ohmie.id
    stake.amount = value
    stake.timestamp = transaction.timestamp;
    stake.save()
}

export function handleUnstake(call: UnstakeOHMCall): void {
    let ohmie = loadOrCreateOHMie(call.from as Address)
    let transaction = loadOrCreateTransaction(call.transaction, call.block)
    let value = toDecimal(call.inputs.amountToWithdraw_, 9)

    ohmie.stakedOHMs = ohmie.stakedOHMs.minus(value)
    ohmie.save()

    let unstake = new Unstake(transaction.id)
    unstake.transaction = transaction.id
    unstake.ohmie = ohmie.id
    unstake.amount = value
    unstake.timestamp = transaction.timestamp;
    unstake.save()
}