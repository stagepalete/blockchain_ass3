import fs from 'fs'
import { ethers } from 'hardhat'

async function main(): Promise<void> {
	// Fetching the signer, typically the first account provided by the Ethereum client.
	const [deployer] = await ethers.getSigners()

	// Retrieve the balance of the deploying account for verification.
	const balance = await deployer.getBalance()
	console.log(`Deploying contracts with the account: ${deployer.address}`)
	console.log(`Account balance: ${balance.toString()}`)

	// Linking to the 'ArtCollectiveMarket' smart contract from the artifacts.
	const Marketplace = await ethers.getContractFactory('ArtCollectiveMarket')
	const marketplace = await Marketplace.deploy()

	// Wait for the contract to be deployed to the Ethereum network.
	await marketplace.deployed()
	console.log(`Marketplace deployed to: ${marketplace.address}`)

	// Preparing contract ABI and address to write to a JSON file for frontend interaction.
	const data = {
		address: marketplace.address,
		abi: JSON.parse(marketplace.interface.format('json')),
	}

	// Write the ABI and address to 'ArtCollectiveMarket.json' for the frontend application to interact with.
	fs.writeFileSync('./ArtCollectiveMarket.json', JSON.stringify(data))

	console.log('Contract address and ABI saved to ArtCollectiveMarket.json')
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error('Error encountered during contract deployment:', error)
		process.exit(1)
	})

// Deploying contracts with the account: 0x77221Aa68406a5210716719Df410e782e2ec22dB
// Account balance: 956658356820650801
// Marketplace deployed to: 0x762EA42e6EE6dc28F22e71B079Ac040628FE68C2
// Contract address and ABI saved to ArtCollectiveMarket.json