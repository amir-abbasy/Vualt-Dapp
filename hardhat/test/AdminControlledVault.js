// SPDX-License-Identifier: MIT
const { expect } = require("chai");
const { ethers } = require("hardhat");

const parseEther = (value) => BigInt(Math.round(value * 1e18));

describe("AdminControlledVault", function () {
  let vault;
  let owner;
  let user;

  const depositAmount = parseEther("1"); // 1 BNB
  const withdrawAmount = parseEther("0.5"); // 0.5 BNB

  beforeEach(async () => {
    // Get the ContractFactory and Signers
    const Vault = await ethers.getContractFactory("AdminControlledVault");
    [owner, user] = await ethers.getSigners();

    // Deploy the contract
    vault = await Vault.deploy();
    // await vault.deployed();
  });

  it("Should set the right owner", async () => {
    expect(await vault.owner()).to.equal(owner.address);
  });

  it("Should allow users to deposit", async () => {
    await vault.connect(user).deposit({ value: depositAmount });

    expect(await vault.balances(user.address)).to.equal(depositAmount);
  });

  it("Should emit a Deposit event when a deposit is made", async () => {
    await expect(vault.connect(user).deposit({ value: depositAmount }))
      .to.emit(vault, "Deposit")
      .withArgs(user.address, depositAmount);
  });

  it("Should allow admin to withdraw on behalf of the user", async () => {
    // User deposits funds
    await vault.connect(user).deposit({ value: depositAmount });

    // Admin withdraws funds for the user
    await vault
      .connect(owner)
      .adminWithdrawForUser(user.address, withdrawAmount);

    // Check user's balance after withdrawal
    expect(await vault.balances(user.address)).to.equal(
      depositAmount - withdrawAmount
    );

    // Check the user's Ether balance after withdrawal
    expect(await ethers.provider.getBalance(user.address)).to.be.above(
      parseEther("0")
    );
  });

  it("Should emit a Withdrawal event when the admin withdraws", async () => {
    await vault.connect(user).deposit({ value: depositAmount });

    await expect(
      vault.connect(owner).adminWithdrawForUser(user.address, withdrawAmount)
    )
      .to.emit(vault, "Withdrawal")
      .withArgs(user.address, withdrawAmount);
  });

  it("Should revert if the user does not have enough balance for withdrawal", async () => {
    await vault.connect(user).deposit({ value: depositAmount });

    await expect(
      vault
        .connect(owner)
        .adminWithdrawForUser(user.address, depositAmount + parseEther(0.5))
    ).to.be.revertedWith("Insufficient user balance");
  });

  it("Should allow the owner to withdraw all funds", async () => {
    await vault.connect(user).deposit({ value: depositAmount });

    // Owner withdraws all funds
    await vault.connect(owner).closeVaultAndWithdrawAll();

    // Check that the vault is empty
    expect(await vault.contractBalance()).to.equal(0);
  });

  it("Should only allow the owner to perform certain actions", async () => {
    await expect(
      vault.connect(user).closeVaultAndWithdrawAll()
    ).to.be.revertedWith("Not the owner");
  });
});
