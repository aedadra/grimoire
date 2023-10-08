const sharp = require('sharp');
const fs = require('fs');


module.exports = async (req, res, next) => {
    if (!req.file) {
        return next()
    }

    try {
        req.file.newFilename = req.file.filename + '.webp';
        req.file.newFilePath = req.file.path + '.webp';

        await sharp(req.file.path)
            .resize(500, 650)
            .webp(90)
            .toFile(req.file.newFilePath) 

        fs.unlink(req.file.path, (error) => {
			if(error) {
            return ({error});
            }
		});
		next();

    } catch (error) {
        res.status(403).json({error})
    }
}