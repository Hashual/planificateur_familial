import { WORKER_DONE_MESSAGE } from "../constants/workers";

const workerScripts = [
	{
		name: 'todoListReming',
		path: './scripts/todoListRemind.ts',
		interval: 60 * 1000,
		lastRun: 0,
		running: false
	}
]

function checkWorkers() {
	for (const workerInfos of workerScripts) {
		if (workerInfos.running) {
			continue;
		}
		if ((Date.now() - workerInfos.lastRun) < workerInfos.interval) {
			continue;
		}

		workerInfos.running = true;
		workerInfos.lastRun = Date.now();
		
		const worker = require(workerInfos.path) as { Run: () => Promise<void> };

		worker.Run().then(() => {
			workerInfos.running = false;
		}).catch((err: Error) => {
			console.error(`Worker ${workerInfos.name} failed: ${err.message}`);
			workerInfos.running = false;
		})
	}
}

export function loadWorkers() {
	checkWorkers();
	setInterval(checkWorkers, 1000);
}