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

import { typesBundleForPolkadot } from "@crustio/type-definitions";
//@ts-expect-error
import { ApiPromise, WsProvider } from '@polkadot/api';
import { sleep } from "./sleep.js";

export async function checkPin(cid: string) {
    // Counter
    let timesChecked: number = 0;

    // Start Polkadot API instance and connect to all rpc api endpoints on the mainnet that are on apps.crust.network (excluding selecting custom)
    const chain = new ApiPromise({
        provider: new WsProvider(['wss://rpc.crust.network', 'wss://crust.api.onfinality.io/public-ws', 'wss://rpc-crust-mainnet.decoo.io']),
        typesBundle: typesBundleForPolkadot
    });

    // Wait for the chain to start
    await chain.isReadyOrError;
    console.log('Chain ready');

    // Check every 10 seconds for 30 minutes
    while (timesChecked < (30 * 60) / 10) {
        // Get chain info
        const fileInfo = JSON.parse(JSON.stringify(await chain.query.market.filesV2(cid)));
        timesChecked += 1;

        if (fileInfo) {
            const replicaCount = fileInfo.reported_replica_count;
            // Check replica count
            if (replicaCount === 0) {
                console.log(`⚠️  ${cid} is pending...`);
            } else {
                // Return block expiry date if there are replicas
                console.log(`✅  ${cid} is picked, replicas: ${replicaCount}`);
                await chain.disconnect();
                return fileInfo.expired_at;
            }
        } else {
            console.error(`🗑  ${cid} is not existed or already expired`);
        }
        await sleep(10000);
    }
    
    // Return 0 if there aren't any replicas after 30 minutes
    await chain.disconnect();
    return 0;
}