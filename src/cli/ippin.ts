#!/usr/bin/env node

/*
* Copyright © 2023 AwesomeKalin55

* MIT Licensed

* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

import yargs from 'yargs';
import { genSignature, loadSignature, saveSignature } from "../util/sigUtil.js";
import inquirer from "inquirer";
import { pinFile } from '../pin.js';
import * as IPFS from 'ipfs-core'
import { getAppDataFolder } from '../util/getAppDataFolder.js';
//@ts-expect-error
import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundleForPolkadot } from '@crustio/type-definitions';
import { checkPin } from '../util/checkPin.js';

// Cli arguments
const argv = yargs(process.argv.slice(2)).options({
    cid: { 'type': 'string', demandOption: true }
}).parseSync();

if (loadSignature() == null) {
    let seedJson: any;

    // Ask what seed phrase is
    await inquirer.prompt([{
        type: 'password',
        name: 'seedPhrase',
        message: 'Please enter your ethereum seed phrase. This doesn\'t get stored on your device: ',
        mask: '*'
    }]).then((answers) => {
        seedJson = answers;
    });

    // Generate the signature required by the Crust Pinning API
    const sig: string = await genSignature(seedJson.seedPhrase);
    saveSignature(sig);
}

// Get Auth Header
const authHeader = loadSignature();

// Start an ipfs node
console.log('Starting IPFS Node');
const ipfsNode = await IPFS.create({ repo: `${getAppDataFolder()}/ipadd/jsipfs`, silent: true });

// Get file size
const fileSizeJson = await ipfsNode.files.stat(`/ipfs/${argv.cid}`)
const fileSize: number = fileSizeJson.cumulativeSize;

// Start Polkadot API Instance
const wsProvider: WsProvider = new WsProvider('wss://api.crust.network');
const api: ApiPromise = ApiPromise.create({ provider: wsProvider, typesBundle: typesBundleForPolkadot });

// Check if file size is under 5GB
if (fileSize <= 5000000000) {
    console.log(`Pinning ${argv.cid}`);
    //@ts-expect-error
    await pinFile(argv.cid, authHeader);
    console.log('Pin requested');

    // Check if file is pinned
    await api.isReady;
    let result = checkPin(argv.cid, api);
}