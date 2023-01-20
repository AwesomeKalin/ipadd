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

import { ApiPromise } from "@polkadot/api/promise/Api";

export function checkPin(cid: string, api: ApiPromise) {
    // Counter
    let timesChecked: number = 0;

    // Check every 10 seconds for 30 minutes
    while (timesChecked < (30*60)/10) {
        //@ts-expect-error
        const apiResult = setTimeout(api.query.market.filesV2(cid), 10000);
        console.log(apiResult);
        timesChecked += 1;
    }
}