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
import * as IPFS from 'ipfs-core'
import { getAppDataFolder } from '../util/getAppDataFolder.js';
import { fileSizePin } from '../util/fileSizePin.js';
import { chunkPinningMode } from '../util/chunkPinMode.js';

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
//@ts-expect-error
const authHeader: string = loadSignature();

// Start an ipfs node
console.log('Starting IPFS Node');
const ipfsNode = await IPFS.create({ repo: `${getAppDataFolder()}/ipadd/jsipfs`, silent: true });

let result: number = await fileSizePin(argv.cid, ipfsNode, authHeader);

// If there is no expiry block, start pinning individual chunks
if (result == 0) {
    console.log('Switching to chunk pinning mode');
    result = await chunkPinningMode(argv.cid, ipfsNode, authHeader);
}

console.log(`Pinned ${argv.cid}. Expires at ${result}`);
process.exit(0);