const picomatch = require("picomatch");
const fs = require("fs");
const path = require("path");

let atlases = [];
let atlasesImages = [];

/**
 * 
 */
const spineDynamicUrl = (options) => (
    {
        name: "spineDynamicUrl",
        buildStart() {
            const atlasInclude = Array.isArray(options.include) ? options.atlasInclude : [options.atlasInclude];

            atlasInclude.forEach((include) => {
                const matcher = picomatch(include);

                atlases = fs.readdirSync(process.cwd(), { recursive: true }).filter((file) => {
                    return matcher(file);
                });
            });

            for(const atlas of atlases.values()) {
                const atlasFolder = atlas.split("/").slice(0, -1).join("/");
                const content = fs.readFileSync(atlas, "utf8");

                const regex = /\b\w+\.png\b/g;
                const images = content.match(regex);
                if(!images) return;

                for(const image of images.values()) {
                    const imageDir = path.join(process.cwd(), atlasFolder, image);
                    const imageName = image;

                    const imageReferenceId = this.emitFile({
                        type: 'asset',
                        name: imageName,
                        source: fs.readFileSync(imageDir),
                    })

                    if(!(atlas in atlasesImages)) atlasesImages[atlas] = {}

                    atlasesImages[atlas][imageName] = {
                        id: imageReferenceId,
                    }
                }
            }
        },
        generateBundle(options, bundle)  {
            for(const atlas in atlasesImages) {
                const atlasFilename = path.basename(atlas);

                Object.values(bundle).forEach(b => console.log({name: b.name, fileName: b.fileName}))

                const jsonFileBundle = Object.values(bundle).find(b => b.name === atlasFilename.replace(".atlas", ".json"));

                if(!jsonFileBundle) {
                    this.error(`Could not find json file for atlas ${atlasFilename}`);
                }

                const hash = jsonFileBundle.fileName.split("-")[1].split(".")[0];
                let atlasContent = fs.readFileSync(atlas, "utf8");

                for(const atlasImage in atlasesImages[atlas]) {
                    const id = atlasesImages[atlas][atlasImage].id;
                    const hashedFileName = this.getFileName(id).replace("assets/", "");

                    atlasContent = atlasContent.replace(atlasImage, hashedFileName);
                }

                const atlasReferenceId = this.emitFile({
                    type: 'asset',
                    fileName: "assets/" + atlasFilename.replace(".atlas", `-${hash}.atlas`),
                    source: atlasContent,
                })
            }
        },
    });

module.exports = spineDynamicUrl;
