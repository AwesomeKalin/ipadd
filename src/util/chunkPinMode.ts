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
import { fileSizePin } from "./fileSizePin.js";

export async function chunkPinningMode(cid: string, ipfsNode: IPFS, authHeader: string) {
    let resultArray: number[] = [];
    for await (const file of ipfsNode.files.ls(`/ipfs/${cid}`)) {
        if(await fileSizePin(file.cid, ipfsNode, authHeader) == 0) {
            resultArray.push(await chunkPinningMode(file.cid, ipfsNode, authHeader));
        }
    }
    return Math.min(...resultArray);
}