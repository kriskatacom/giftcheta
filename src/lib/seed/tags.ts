import Tag from "@/models/Tag";
import tagsData from "@/data/tags.json";
import * as cliProgress from "cli-progress";

export async function seedTags() {
    const progressBar = new cliProgress.SingleBar({
        format: "Тагове    | {bar} | {percentage}% | {value}/{total} Тага",
    });

    const total = tagsData.length;
    progressBar.start(total, 0);

    for (let i = 0; i < total; i++) {
        await Tag.upsert(tagsData[i], { logging: false });
        progressBar.update(i + 1);
    }

    progressBar.stop();
}
