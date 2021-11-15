
const cheerio = require('cheerio');
const axios = require('axios');
const _ = require("lodash")
async function extractNewListingsFromHTML(callback) {
  let listOfLinks = [];
  await axios('https://coinmarketcap.com/new/')
    .then(({ data }) => {
      const $ = cheerio.load(data);
      const allLinks = $("a");

      for (let i = 0; i < allLinks.length; ++i) {
        listOfLinks.push(allLinks.get(i).attribs.href)
      }
      listOfLinks = listOfLinks.filter(e => {
        if (e?.indexOf('/currencies/') == 0)
          return e;
      })

      // const table = $(".cmc-table");
      // console.log("🚀 ~ file: parseHtml.js ~ line 21 ~ .then ~ table2", table);
      // table[0]?.lastChild?.children.map(el => {
      //   const found = $(el).find("td").children().children();
      //   console.log("🚀 ~ file: parseHtml.js ~ line 20 ~ .then ~ table", $(found).text());
      // });
      return listOfLinks;
    }).catch(callback);
  return listOfLinks;
}
async function extractDatumFromListing(link, callback) {
  return new Promise(async (resolve) => {
    await axios('https://coinmarketcap.com/' + link)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const nameHeader = $('.nameHeader h2');
        // console.log("🚀 ~ file: parseHtml.js ~ line 34 ~ .then ~ nameHeader", nameHeader);
        const linksSection = $('.link-button');
        const symbolName = nameHeader.find('.nameSymbol').text() != '' && nameHeader.find('.nameSymbol').text();
        const cmcName = nameHeader.text().replace(symbolName, '');
        const contractLink = linksSection.get(1).attribs.href ? linksSection.get(1).attribs.href : "";
        const webLink = linksSection.get(0).attribs.href ? linksSection.get(0).attribs.href : "";
        const chainType = contractLink.indexOf('https://bscscan.com') == 0 ? 'BSC' : 'Others';
        const tokenAddress = contractLink.replace('https://bscscan.com/address/', '');
        const poocoin = "https://poocoin.app/tokens/" + tokenAddress;
        const res = { symbolName, cmcName, tokenAddress, chainType, webLink, contractLink, poocoin }
        resolve(res);
      }).catch(callback);
  });
}
async function extractDataFromListing(links, callback) {
  return new Promise(async (resolve) => {
    links.map(async e => {
      await axios('https://coinmarketcap.com/' + e)
        .then(({ data }) => {
          const $ = cheerio.load(data);
          const nameHeader = $('.nameHeader h2');
          // console.log("🚀 ~ file: parseHtml.js ~ line 34 ~ .then ~ nameHeader", nameHeader);
          const linksSection = $('.link-button');
          const symbolName = nameHeader.find('.nameSymbol').text() != '' && nameHeader.find('.nameSymbol').text();
          const cmcName = nameHeader.text().replace(symbolName, '');
          const contractLink = linksSection.get(1).attribs.href ? linksSection.get(1).attribs.href : "";
          const webLink = linksSection.get(0).attribs.href ? linksSection.get(0).attribs.href : "";
          const chainType = contractLink.indexOf('https://bscscan.com') == 0 ? 'BSC' : 'Others';
          const tokenAddress = contractLink.replace('https://bscscan.com/address/', '');
          const poocoin = "https://poocoin.app/tokens/" + tokenAddress;
          const res = { symbolName, cmcName, tokenAddress, chainType, webLink, contractLink, poocoin }
          resolve(res);
        }).catch(callback);
    })
  });
}
module.exports = {
  extractNewListingsFromHTML,
  extractDataFromListing,
  extractDatumFromListing
};