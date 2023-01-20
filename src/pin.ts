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

import got from 'got';

export async function pinFile(cid: string, authHeader: string) {
    // Set Pinning Service
    const ipfsPinningService: string = 'https://pin.crustcode.com/psa';

    // In try-catch in case it fails
    try {
        //@ts-expect-error
        const { body } = await got.post(
            ipfsPinningService + '/pins',
            {
                headers: {
                    authorization: 'Bearer ' + authHeader
                },
                json: {
                    cid: cid,
                    name: 'ipadd-pinned-file'
                }
            }
        ).json();
        if (body != null) {
            return true;
        }
    }
    catch (err) {
        pinFile(cid, authHeader);
    }
}