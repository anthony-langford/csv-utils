const csv = require("csv-parse");
const fs = require("fs");

const nasdaqListings = [];
const otherListings = [];
// const nasdaqListings = {};
// const otherListings = {};

// Generate ticker array ['AAPL']
// fs.createReadStream(__dirname + "/nasdaq_listings.csv")
//   .pipe(csv())
//   .on("data", (row) => {
//     nasdaqListings.push(row[0]);
//   })
//   .on("end", () => {
//     fs.writeFile(
//       __dirname + "/nasdaq_listings_array.txt",
//       nasdaqListings.toString(),
//       (err) => {
//         if (err) return console.log(err);
//       }
//     );
//     console.log("CSV file nasdaq_listings.csv successfully processed");
//   });

// Generate ticker array ['AAPL']
// fs.createReadStream(__dirname + "/other_listings.csv")
//   .pipe(csv())
//   .on("data", (row) => {
//     otherListings.push(row[0]);
//   })
//   .on("end", () => {
//     fs.writeFile(
//       __dirname + "/other_listings.txt",
//       otherListings.toString(),
//       (err) => {
//         if (err) return console.log(err);
//       }
//     );
//     console.log("CSV file other_listings.csv successfully processed");
//   });

const cleanCompanyName = (companyName) => {
  const skipList = {
    "A-Mark Precious Metals": "A-Mark Precious Metals",
    "Artesian Resources Corporation - Class A Non-Voting Common Stock":
      "Artesian Resources Corporation",
    "Art's-Way Manufacturing Co.": "Art's-Way Manufacturing Co.",
    "BIO-key International": "BIO-key International",
    "Bio-Path Holdings": "Bio-Path Holdings",
    "Cal-Maine Foods": "Cal-Maine Foods",
    "Co-Diagnostics": "Co-Diagnostics",
    "Coca-Cola Consolidated": "Coca-Cola",
    "Core-Mark Holding Company": "Core-Mark Holding Company",
    "Electro-Sensors": "Electro-Sensors",
    "Ever-Glory International Group": "Ever-Glory International Group",
    "1-800-FLOWERS.COM": "1-800-FLOWERS.COM",
    "F-star Therapeutics": "F-star Therapeutics",
    "G-III Apparel Group": "G-III Apparel Group",
    "Heritage-Crystal Clean": "Heritage-Crystal Clean",
    "Multi-Asset Diversified Income Index Fund":
      "Multi-Asset Diversified Income Index Fund",
    "Mid-Southern Bancorp": "Mid-Southern Bancorp",
    "Pro-Dex": "Pro-Dex",
    "Perma-Fix Environmental Services": "Perma-Fix Environmental Services",
    "Perma-Pipe International Holdings": "Perma-Pipe International Holdings",
    "Patterson-UTI Energy": "Patterson-UTI Energy",
    "SI-BONE": "SI-BONE",
    "Sino-Global Shipping America": "Sino-Global Shipping America",
    "T-Mobile US": "T-Mobile",
    "Take-Two Interactive Software": "Take-Two Interactive Software",
    "United-Guardian": "United-Guardian",
    "urban-gro": "urban-gro",
    "Y-mAbs Therapeutics": "Y-mAbs Therapeutics",
    "Archer-Daniels-Midland Company Common Stock":
      "Archer-Daniels-Midland Company Common Stock",
    "Ampco-Pittsburgh Corporation Common Stock":
      "Ampco-Pittsburgh Corporation Common Stock",
    "Ampco-Pittsburgh Corporation Series A Warrants to purchase Shares of common stock":
      "Ampco-Pittsburgh Corporation",
    "Build-A-Bear Workshop": "Build-A-Bear Workshop",
    "Bio-Rad Laboratories": "Bio-Rad Laboratories",
    "Bristol-Myers Squibb Company Common Stock": "Bristol-Myers Squibb Company",
    "Anheuser-Busch Inbev SA Sponsored ADR (Belgium)": "Anheuser-Busch",
    "Can-Fite Biopharma Ltd Sponsored ADR (Israel)": "Can-Fite Biopharma Ltd",
    "Coca-Cola European Partners plc Ordinary Shares":
      "Coca-Cola European Partners",
    "Bristol-Myers Squibb Company Celegne Contingent Value Rights":
      "Bristol-Myers Squibb Company",
    "Consonance-HFW Acquisition Corp. Class A Ordinary Shares":
      "Consonance-HFW Acquisition Corp.",
    "Consonance-HFW Acquisition Corp. Units":
      "Consonance-HFW Acquisition Corp.",
    "Consonance-HFW Acquisition Corp. Warrants":
      "Consonance-HFW Acquisition Corp.",
    "Colgate-Palmolive Company Common Stock": "Colgate-Palmolive Company",
    "Cleveland-Cliffs Inc. Common Stock": "Cleveland-Cliffs Inc.",
    "Mack-Cali Realty Corporation Common Stock": "Mack-Cali Realty Corporation",
    "Cooper-Standard Holdings Inc. Common Stock":
      "Cooper-Standard Holdings Inc.",
    "Cel-Sci Corporation Common Stock": "Cel-Sci Corporation",
    "Curtiss-Wright Corporation Common Stock": "Curtiss-Wright Corporation",
    "Dril-Quip": "Dril-Quip",
    "Freeport-McMoRan": "Freeport-McMoRan",
    "Franco-Nevada Corporation": "Franco-Nevada Corporation",
    "Gorman-Rupp Company (The) Common Stock":
      "Gorman-Rupp Company (The) Common Stock",
    "Triple-S Management Corporation Class B Common Stock":
      "Triple-S Management Corporation Class B Common Stock",
    "Harley-Davidson": "Harley-Davidson",
    "Hill-Rom Holdings Inc Common Stock": "Hill-Rom Holdings Inc Common Stock",
    "Hyster-Yale Materials Handling": "Hyster-Yale Materials Handling",
    "AEA-Bridges Impact Corp. Class A Ordinary Shares":
      "AEA-Bridges Impact Corp.",
    "AEA-Bridges Impact Corp. Units": "AEA-Bridges Impact Corp.",
    "AEA-Bridges Impact Corp. Warrants": "AEA-Bridges Impact Corp.",
    "JELD-WEN Holding": "JELD-WEN Holding",
    "Kimberly-Clark Corporation Common Stock": "Kimberly-Clark Corporation",
    "Knight-Swift Transportation Holdings Inc.":
      "Knight-Swift Transportation Holdings Inc.",
    "Coca-Cola Company (The) Common Stock": "Coca-Cola Company",
    "Kennedy-Wilson Holdings Inc. Common Stock": "Kennedy-Wilson Holdings Inc.",
    "Louisiana-Pacific Corporation Common Stock":
      "Louisiana-Pacific Corporation",
    "La-Z-Boy Incorporated Common Stock": "La-Z-Boy Incorporated",
    "Mid-America Apartment Communities": "Mid-America Apartment Communities",
    "M3-Brigade Acquisition II Corp. Units": "M3-Brigade Acquisition II Corp.",
    "Mettler-Toledo International": "Mettler-Toledo International",
    "Network-1 Technologies": "Network-1 Technologies",
    "Oil-Dri Corporation Of America Common Stock":
      "Oil-Dri Corporation Of America",
    "O-I Glass": "O-I Glass",
    "Parker-Hannifin Corporation Common Stock": "Parker-Hannifin Corporation",
    "Sherwin-Williams Company (The) Common Stock":
      "Sherwin-Williams Company (The)",
    "Snap-On Incorporated Common Stock": "Snap-On Incorporated",
    "Schweitzer-Mauduit International": "Schweitzer-Mauduit International",
    "Trio-Tech International Common Stock": "Trio-Tech International",
    "Williams-Sonoma": "Williams-Sonoma",
  };
  if (skipList[companyName]) {
    console.log("hit");
    return skipList[companyName];
  }
  // Find dashes, find leftmost index of connected characters, then remove everything after
  const dashIndexes = [];

  for (let i = 0; i < companyName.length; i++) {
    if (companyName[i] === "-") dashIndexes.push(i);
  }

  if (!dashIndexes.length) return companyName;

  const lastDashIndex = dashIndexes[dashIndexes.length - 1];
  let currentIndex = lastDashIndex;
  let startDeleteIndex = 0;

  do {
    const previousChar = companyName[currentIndex - 1];
    if (previousChar === " ") startDeleteIndex = currentIndex - 1;
    else currentIndex -= 1;
  } while (startDeleteIndex === 0);

  return companyName.substr(0, startDeleteIndex);
};

// Generate json { AAPL: ['AAPL', 'Apple Inc'] }
// fs.createReadStream(__dirname + "/nasdaq_listings.csv")
//   .pipe(csv())
//   .on("data", (row) => {
//     row[1] = cleanCompanyName(row[1]);
//     const ticker = row[0];
//     otherListings[ticker] = row;
//   })
//   .on("end", () => {
//     console.log(nasdaqListings);
//     fs.writeFile(
//       __dirname + "/nasdaq_listings_array.json",
//       JSON.stringify(nasdaqListings),
//       (err) => {
//         if (err) return console.log(err);
//       }
//     );
//     console.log("CSV file nasdaq_listings.csv successfully processed");
//   });

// fs.createReadStream(__dirname + "/other_listings.csv")
//   .pipe(csv())
//   .on("data", (row) => {
//     console.log(row);
//     const companyName = cleanCompanyName(row[1]);
//     console.log(row);
//     row[1] = companyName;
//     const ticker = row[0];
//     otherListings[ticker] = row;
//   })
//   .on("end", () => {
//     fs.writeFile(
//       __dirname + "/other_listings.json",
//       JSON.stringify(otherListings),
//       (err) => {
//         if (err) return console.log(err);
//       }
//     );
//     console.log("CSV file other_listings.csv successfully processed");
//   });

// Generate ticker array json file from nasdaq and other listings comma-delimited text files
// const mergeDelimitedText = () => {
//   const nasdaqListingsText = fs.readFileSync(
//     __dirname + "/nasdaq_listings.txt",
//     "utf8"
//   );
//   const nasdaqListingsArray = nasdaqListingsText.split(",");

//   const otherListingsText = fs.readFileSync(
//     __dirname + "/other_listings.txt",
//     "utf8"
//   );
//   const otherListingsArray = otherListingsText.split(",");
//   const allListingsText = fs.readFileSync(
//     __dirname + "/all_listings.json",
//     "utf8"
//   );
//   const parsedListings = JSON.parse(allListingsText);
//   parsedListings.allListings.push(
//     ...nasdaqListingsArray,
//     ...otherListingsArray
//   );
//   fs.writeFile(
//     __dirname + "/all_listings.json",
//     JSON.stringify(parsedListings),
//     (err) => {
//       if (err) return console.log(err);
//     }
//   );
//   console.log("Done");
// };

// mergeDelimitedText();
