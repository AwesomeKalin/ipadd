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

import { ethers } from 'ethers';
import fs from 'fs-extra';
import { getAppDataFolder } from './getAppDataFolder.js';

export function saveSignature(signature: string) {
    // Get AppData Folder
    const appData: string = getAppDataFolder();

    // Write signature to AppData Folder/ipadd/signature.ipadd
    fs.outputFileSync(`${appData}/ipadd/signature.ipadd`, signature);
}

export function loadSignature() {
    // Get AppData folder
    const appData: string = getAppDataFolder();
    if (fs.existsSync(`${appData}/ipadd/signature.ipadd`)){
        return fs.readFileSync(`${appData}/ipadd/signature.ipadd`, {encoding:'utf8', flag:'r'});
    }
    return null;
}

export async function genSignature(seedPhrase: string) {
    // Get keypair
    const pair: ethers.HDNodeWallet = ethers.Wallet.fromPhrase(seedPhrase);

    // Get ethereum address and sign it
    const signature: string = await pair.signMessage(pair.address);

    // Create authHeader, encode with base64 and return it
    const authHeader: string = `eth-${pair.address}:${signature}`;
    return Buffer.from(authHeader).toString('base64');
}