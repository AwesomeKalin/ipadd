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

import { IPFS } from "ipfs-core";
import { checkPin } from "./checkPin.js";
import { pinFile } from '../pin.js';

export async function fileSizePin(cid: string, ipfsNode: IPFS, authHeader: string) {
    let result: number;

    // Get file size
    const fileSizeJson = await ipfsNode.files.stat(`/ipfs/${cid}`)
    const fileSize: number = fileSizeJson.cumulativeSize;

    if (fileSize <= 5000000000) {
        console.log(`Pinning ${cid}`);
        await pinFile(cid, authHeader);
        console.log('Pin requested');

        // Check if file is pinned
        result = await checkPin(cid);
    } else {
        result = 0;
    }

    return result;
}