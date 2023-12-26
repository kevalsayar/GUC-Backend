const { CERTIFICATE_UPLOAD } = require("../config/env"),
  { HelperFunction } = require("./helper"),
  path = require("path"),
  fs = require("fs"),
  { ConstantMembers } = require("./members"),
  puppeteer = require("puppeteer");

/**
 * Utility functions for various tasks within the application.
 *
 * @namespace UtilFunctions
 * @property {function} generateDonationCertiPDF - Generates a PDF certificate based on provided data.
 */
const UtilFunctions = () => {
  /**
   * @description Generates a PDF certificate based on provided data.
   * @param {Object} data - Data for generating the PDF certificate.
   * @param {string} data.certificateId - The unique identifier for the certificate.
   * @returns {Promise<boolean>} - Resolves with `true` if the PDF generation is successful, otherwise `false`.
   */
  const generateDonationCertiPDF = async (data) => {
    try {
      if (!fs.existsSync(path.join(process.cwd(), CERTIFICATE_UPLOAD))) {
        fs.mkdirSync(path.join(process.cwd(), CERTIFICATE_UPLOAD));
      }

      const browser = await puppeteer.launch(
        process.env.NODE_ENV.trim() === "production"
          ? {
              headless: "new",
              executablePath: "/usr/bin/google-chrome",
              args: ["--no-sandbox", "--disable-gpu"],
            }
          : { headless: "new" }
      );

      const page = await browser.newPage();

      await page.setContent(
        await HelperFunction.getTemplate(
          ConstantMembers.HTML_TEMPLATES.DEMO_GUC_DONATION_CERTI,
          data
        ),
        {
          waitUntil: "load",
        }
      );
      await page.emulateMediaType("screen");

      await page.pdf({
        path: path.join(
          process.cwd(),
          CERTIFICATE_UPLOAD,
          `${data.certificateId}.pdf`
        ),
        format: "A4",
        printBackground: true,
        landscape: true,
      });

      await browser.close();

      return true;
    } catch (error) {
      return false;
    }
  };

  return { generateDonationCertiPDF };
};

module.exports = {
  UtilFunction: UtilFunctions(),
};
