//node product_Addtocart.js  --config=config.json
let fs=require("fs");
let minimist=require("minimist");

let puppeteer=require("puppeteer");

let args=minimist(process.argv);

let configJSON =fs.readFileSync(args.config,"utf-8");
let configJSO=JSON.parse(configJSON);
async function run()
{
    let browser = await puppeteer.launch({

        headless:false,
        defaultViewport:null,
        args: [
            "--start-maximized", // you can also use '--start-fullscreen'
        ],
    });
  let pages = await browser.pages();
  let page=pages[0];
  await page.bringToFront();
  await page.goto('https://www.amazon.in');
  await page.waitForSelector("span#nav-link-accountList-nav-line-1");
  await page.click("span#nav-link-accountList-nav-line-1");
  await page.waitForSelector('input[type="email"]');
  await page.type('input[type="email"]',configJSO.phone,{delay:50});
  await page.waitForSelector('input#continue');
  await page.click('input#continue');
  await page.waitForSelector('input[type="password"]');
  await page.type('input[type="password"]',configJSO.password,{delay:50});
  await page.waitForSelector('input#signInSubmit');
  await page.click('input#signInSubmit');

//   await browser.close();

    let flipkartPage=await browser.newPage();
    await flipkartPage.bringToFront();
    await flipkartPage.goto("https://www.flipkart.com");
    await flipkartPage.waitForSelector("label._1fqY3P");
    
    await flipkartPage.type("label._1fqY3P",configJSO.phone,{delay:50})
    await flipkartPage.waitForSelector('input[type="password"]');
    await flipkartPage.type('input[type="password"]',configJSO.password,{delay:50});
    await flipkartPage.keyboard.press("Enter");
    await flipkartPage.waitForTimeout(3000);

    await page.bringToFront();
    await page.waitForSelector('input[type="text"]');
    await page.type('input[type="text"]',"samsung galaxy m12",{delay:50});
    await page.keyboard.press("Enter");
    await page.waitForTimeout(3000);
    await page.waitForSelector("span.a-price-whole");
    let element = await page.$("span.a-price-whole")
    let value = await page.evaluate(el => el.textContent, element);
    let vals=value.split(",");
    let totalPrice="";
    for(let i=0;i<vals.length;i++)
    {
        totalPrice+=vals[i];
    }
    // value=parseInt(value.substring(0,1)+value.substring(2));
    value=parseInt(totalPrice);
    console.log(typeof value +" "+value);
 

    await flipkartPage.bringToFront();
    await flipkartPage.waitForTimeout(4000);
    await flipkartPage.waitForSelector('input[type="text"]');
    await flipkartPage.type('input[type="text"]',"samsung galaxy m12",{delay:50});
    await flipkartPage.keyboard.press("Enter");
    await flipkartPage.waitForTimeout(3000);
    await flipkartPage.waitForSelector("div._30jeq3._1_WHN1");
    let element1 = await flipkartPage.$("div._30jeq3._1_WHN1")
    let val = await flipkartPage.evaluate(el => el.textContent, element1)
    // val=parseInt(val.substring(1,2)+val.substring(3));
    val=val.substring(1);
    let vals2=val.split(",");
    let totalPrice2="";
    for(let i=0;i<vals2.length;i++)
    {
        totalPrice2+=vals2[i];
    }
    val=parseInt(totalPrice2);
    console.log(typeof val +" "+val);
    if(value<=val)
    {
        await page.bringToFront();   
        await page.waitForSelector("a.a-link-normal.a-text-normal");    
        let url=await page.$eval("a.a-link-normal.a-text-normal",function(atag){
            let insideUrl=atag.getAttribute("href");
            // console.log(insideUrl);
            return insideUrl;
        })
        
        let completeUrl="https://www.amazon.in"+url;
        console.log(completeUrl);
        await page.goto(completeUrl);
        await page.waitForTimeout(3000);
        // await page.waitForSelector('span.a-price-whole');
        // await page.click('span.a-price-whole');
        await page.waitForSelector('input[name="submit.add-to-cart"]');
        await page.click('input[name="submit.add-to-cart"]');

    }
    else{
        await flipkartPage.bringToFront();
        await flipkartPage.waitForSelector('a[rel="noopener noreferrer"]');
        let url=await flipkartPage.$eval('a[rel="noopener noreferrer"]',function(atag){
            let insideUrl=atag.getAttribute("href");
            // console.log(insideUrl);
            return insideUrl;
        })
        let completeUrl="https://www.flipkart.com"+url;
        console.log(completeUrl);
        await flipkartPage.goto(completeUrl);
        await flipkartPage.waitForTimeout(3000);
        await flipkartPage.waitForSelector('button._2KpZ6l._2U9uOA._3v1-ww');
        await flipkartPage.click('button._2KpZ6l._2U9uOA._3v1-ww');

    }
    
}

run();