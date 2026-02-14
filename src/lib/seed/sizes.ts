import Size from "@/models/Size";
import sizesData from "@/data/sizes.json";
import * as cliProgress from "cli-progress";

export async function seedSizes() {
    const progressBar = new cliProgress.SingleBar({
        format: "Размери   | {bar} | {percentage}% | {value}/{total} Размера",
    });

    const total = sizesData.length;
    progressBar.start(total, 0);

    for (let i = 0; i < total; i++) {
        await Size.upsert(sizesData[i], { logging: false });
        progressBar.update(i + 1);
    }

    progressBar.stop();
}
