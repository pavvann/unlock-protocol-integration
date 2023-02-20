export default function handler(req,res) {
    const tokenId = req.query.tokenId;
    const image_url = "https://gateway.pinata.cloud/ipfs/QmQfuzSTdRVGm89CbTVqg2KNsAxga3ooTZKFXU8nU8Pvbh?_gl=1*19xo2j5*_ga*MTE4Mzc2MTM5LjE2NzU3NDc1NTc.*_ga_5RMPXG14TE*MTY3NTc1OTIzNi4yLjEuMTY3NTc1OTI2Mi4zNC4wLjA.";
    res.status(200).json({
        name: "beyondClub testing" + tokenId,
        description: "beyondclub nfts",
        image: image_url
    });
}