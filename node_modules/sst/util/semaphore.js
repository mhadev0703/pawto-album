export class Semaphore {
    queue = [];
    locked = 0;
    maxLocks;
    constructor(maxLocks = 1) {
        this.maxLocks = maxLocks;
    }
    lock() {
        return new Promise((resolve) => {
            const unlock = () => {
                this.locked--;
                const next = this.queue.shift();
                if (next) {
                    this.locked++;
                    next(unlock);
                }
            };
            if (this.locked < this.maxLocks) {
                this.locked++;
                resolve(unlock);
            }
            else {
                this.queue.push(unlock);
            }
        });
    }
}
