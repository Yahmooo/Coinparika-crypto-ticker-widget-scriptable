/*
==============================

    Code inspired of this Repo: https://github.com/wickenico/btc-usd-course.js

    Coded by: Yahmo
    Contact me:
        Discord: Yahmo#1941
        Telegram: @Yahmoooo
        
    Version: 1.0.0
        
==============================      
*/
/*
==============================

    Information
    
==============================   
*/
/*

You can only track coins that are listed on CoinPaprika: https://coinpaprika.com/

*/
/*
==============================

    Config Start
    
==============================   
*/
    
    let bgColor = new Color("#1C1C1E") // Color of the Background 
    let txtTitle = new Color("#ffffff") // Color of the Title 
    let txtPrice = new Color("#ffffff") // Color of the Price 
    let txtVolume = new Color("#ffffff") // Color of the Volume 
    let txtDate = new Color("#ffffff") // Color of the Date 
    let minusPercent = new Color("#fc0303") // Red Color do Display if percent is -
    let plusPercent = new Color("#4d8535") // Green Color do Display if percent is +
    let tokenSymbol = "hmmm-hmmm" // Token need to be listed on Coinpaprika
    let numberAfterCommaPrice = "2" // how many numbers should be displayed after the comma Price
    let numberAfterCommaVolume = "2" // how many numbers should be displayed after the comma Volume
    
/*
==============================

    Config end
    
==============================
*/


/*
==============================

Coinpaprika API

==============================
*/

let reqPaprika = new Request("https://api.coinpaprika.com/v1/tickers/" + tokenSymbol);
reqPaprika.method = "get";
reqPaprika.headers = {
    "content-type": "application/json",
};




let reqPaprikaImage = new Request('https://api.coinpaprika.com/v1/coins/' + tokenSymbol);
reqPaprikaImage.method = "get";
reqPaprikaImage.headers = {
    "content-type": "application/json",
};


/*
==============================

fetch api

==============================
*/

let resPaprikaImage = await reqPaprikaImage.loadJSON();
log(JSON.stringify(resPaprikaImage, null, 2));
let resPaprika = await reqPaprika.loadJSON();
log(JSON.stringify(resPaprika, null, 2));




// Get Image from api
let logo = (resPaprikaImage.logo)
let req2 = new Request(logo);
let image = await req2.loadImage();




//24 price change
const percentChange24h = (resPaprika.quotes.USD.percent_change_24h);
const pricePaprika = Number(resPaprika.quotes.USD.price);
let roundPricePaprika = pricePaprika.toFixed(numberAfterCommaPrice);

const volume = (resPaprika.quotes.USD.volume_24h)
//make number to friendly format code is from: https://stackoverflow.com/questions/2685911/is-there-a-way-to-round-numbers-into-a-reader-friendly-format-e-g-1-1k?noredirect=1&lq=1
function abbrNum(number, decPlaces) {
    var orig = number;
    var dec = decPlaces;
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10, decPlaces);

    // Enumerate number abbreviations
    var abbrev = ["k", "m", "b", "t"];

    // Go through the array backwards, so we do the largest first
    for (var i = abbrev.length - 1; i >= 0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10, (i + 1) * 3);

        // If the number is bigger or equal do the abbreviation
        if (size <= number) {
            // Here, we multiply by decPlaces, round, and then divide by decPlaces.
            // This gives us nice rounding to a particular decimal place.
            var number = Math.round(number * decPlaces / size) / decPlaces;

            // Handle special case where we round up to the next abbreviation
            if((number == 1000) && (i < abbrev.length - 1)) {
                number = 1;
                i++;
            }

            // console.log(number);
            // Add the letter for the abbreviation
            number += abbrev[i];

            // We are done... stop
            break;
        }
    }

    console.log('abbrNum('+ orig + ', ' + dec + ') = ' + number);
    return number;
}

abbrNum(volume, 2); //       => 999.995k

let volumeNormal;
      

if(abbrNum(volume, 2) < 1000) {
  volumeNormal = volume.toFixed(numberAfterCommaVolume);
}else {
volumeNormal = abbrNum(volume, 2);
}
//Short the price Live
const name = (resPaprika.name);
let roundVolumePaprika = volume.toFixed(numberAfterCommaVolume);


/*
==============================

API Ends

==============================
*/

// widget.backgroundImage(img)
 
let widget = createWidget()
widget.setPadding(7, 6, 2, 6);
widget.backgroundColor = bgColor
if (config.runsInWidget) {
  // create and show widget
  Script.setWidget(widget)
  Script.complete()
}
else {
  widget.presentSmall()
}

function createWidget(img) {
  let w = new ListWidget()
  /*
==============================

Lockscreenbottom param

==============================
*/
if(args.widgetParameter == "lockscreenbottom") {
  let w = new ListWidget()

  // Check if percent is in minus or plus
  let isMinus = Math.sign(percentChange24h)

  let percentTxt = w.addText(percentChange24h + "%")
  percentTxt.font = Font.systemFont(14)
  percentTxt.centerAlignText()
  if (isMinus == -1) {
    percentTxt.textColor = minusPercent
  } else {
    percentTxt.textColor = plusPercent
  }

  
  w.addSpacer(2)
 

  let amountTxt = w.addText("price: " + roundPricePaprika + "$")
  amountTxt.textColor = txtPrice
  amountTxt.font = Font.systemFont(14)
  amountTxt.centerAlignText()

  w.addSpacer(2)
  
  
  let volumeTxt = w.addText("Vol: " + volumeNormal + "$")
  volumeTxt.textColor = txtVolume
  volumeTxt.font = Font.systemFont(14)
  volumeTxt.centerAlignText()
  
   w.addSpacer(8)
  
  return w
  /*
==============================

Lockscreentop Param

==============================
*/
  } else if(args.widgetParameter == "lockscreentop") {
     let w = new ListWidget()
     let amountTxt = w.addText(name + " " + ":" + roundPricePaprika + "$")
         amountTxt.textColor = txtPrice
         amountTxt.font = Font.systemFont(16)
         amountTxt.centerAlignText()
    return w
  }
    /*
==============================

Normal Widget

==============================
*/
    else {
  let w = new ListWidget()
  let w2 = ListWidget
    let st1 = w.addStack()  
        st1.addSpacer()
          // Add logo to Widget via api
      const image1 = st1.addImage(image)
            image1.imageSize = new Size(20, 20);
            image1.cornerRadius = 6
      const text = st1.addText( name + " -" + " USD")
            text.textColor = txtTitle
            text.font = Font.mediumRoundedSystemFont(16)
        st1.addSpacer()
            text.centerAlignText()
      
 
  
  w.addSpacer(2)

  // Check if percent is in minus or plus
  let isMinus = Math.sign(percentChange24h)

  let percentTxt = w.addText(percentChange24h + "%")
  percentTxt.font = Font.systemFont(15)
  percentTxt.centerAlignText()
  if (isMinus == -1) {
    percentTxt.textColor = minusPercent
  } else {
    percentTxt.textColor = plusPercent
  }

  
  w.addSpacer(2)
 

  let amountTxt = w.addText("price: " + roundPricePaprika + "$")
  amountTxt.textColor = txtPrice
  amountTxt.font = Font.systemFont(13)
  amountTxt.centerAlignText()

  //   let currencyTxt = w.addText(currency)
  //   currencyTxt.textColor = Color.gray()
  //   currencyTxt.font = Font.systemFont(10)
  //   currencyTxt.centerAlignText()

  w.addSpacer(2)
  
  
    let volumeTxt = w.addText("Vol: " + volumeNormal + "$")

  volumeTxt.textColor = txtVolume
  volumeTxt.font = Font.systemFont(13)
  volumeTxt.centerAlignText()
  
   w.addSpacer(8)
  

  // Show current date in format Day. Month Year
  let currentDate = new Date();
  let lastDate = w.addDate(currentDate);
  lastDate.textColor = txtDate
  lastDate.font = Font.mediumSystemFont(10)
  lastDate.centerAlignText();

  w.setPadding(0, 0, 0, 0)
    return w
    }
  return w
}
