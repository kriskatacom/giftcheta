import Color from "@/models/Color";
import colorsData from "@/data/colors.json";
import * as cliProgress from "cli-progress";

export async function seedColors() {
    const progressBar = new cliProgress.SingleBar({
        format: "Цветове   | {bar} | {percentage}% | {value}/{total} Цвята",
    });

    const total = colorsData.length;
    progressBar.start(total, 0);

    for (let i = 0; i < total; i++) {
        await Color.upsert(colorsData[i], { logging: false });
        progressBar.update(i + 1);
    }

    progressBar.stop();
}
