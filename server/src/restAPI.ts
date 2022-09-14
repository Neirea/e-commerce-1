import { v2 as cloudinary } from "cloudinary";
import { UploadedFile } from "express-fileupload";
import fs from "fs";
import { StatusCodes } from "http-status-codes";
import passport from "passport";
import { app } from ".";
import { failedLogin, loginCallback } from "./passport";

//auth routes
app.get("/auth/login/failed", failedLogin);
//google
app.get("/auth/login/google", (req, res, next) => {
	app.set("redirect", req.query.path);
	passport.authenticate("google", {
		session: false,
		scope: ["profile", "email"],
	})(req, res, next);
});
app.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		session: false,
		failureRedirect: "/auth/login/failed",
	}),
	loginCallback
);
//facebook
app.get("/auth/login/facebook", (req, res, next) => {
	app.set("redirect", req.query.path);
	passport.authenticate("facebook", {
		session: false,
		scope: ["email"],
	})(req, res, next);
});
app.get(
	"/auth/facebook/callback",
	passport.authenticate("facebook", {
		session: false,
		failureRedirect: "/auth/login/failed",
	}),
	loginCallback
);
app.post("/editor/upload-images", async (req, res) => {
	interface UploadedImage {
		img_id: string;
		img_src: string;
	}
	const imageFiles = req.files?.images as UploadedFile[] | UploadedFile;
	if (Array.isArray(imageFiles)) {
		if (!imageFiles || !imageFiles.length) {
			res.json({ images: [] });
			return;
		}
		interface UploadedImage {
			img_id: string;
			img_src: string;
		}
		const resultImages: UploadedImage[] = [];

		for (let i = 0; i < imageFiles.length; i++) {
			const result = await cloudinary.uploader.upload(
				imageFiles[i].tempFilePath,
				{
					transformation: [
						{
							width: 640,
							height: 640,
							crop: "lfill",
							fetch_format: "jpg",
						},
					],
					folder: "ecommerce-1",
				}
			);
			resultImages.push({
				img_id: result.public_id,
				img_src: result.secure_url,
			});
			fs.unlinkSync(imageFiles[i].tempFilePath);
		}
		res.status(StatusCodes.OK).json({ images: resultImages });
		return;
	} else {
		if (!imageFiles) {
			res.json({ images: [] });
			return;
		}

		const resultImages: UploadedImage[] = [];
		const result = await cloudinary.uploader.upload(imageFiles.tempFilePath, {
			transformation: [
				{
					width: 640,
					height: 640,
					crop: "lfill",
					fetch_format: "jpg",
				},
				{
					fetch_format: "jpg",
				},
			],
			folder: "ecommerce-1",
		});

		resultImages.push({
			img_id: result.public_id,
			img_src: result.secure_url,
		});
		fs.unlinkSync(imageFiles.tempFilePath);
		res.status(StatusCodes.OK).json({ images: resultImages });
	}
});
