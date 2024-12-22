const express = require("express");
const router = express.Router();
const postcss = require("postcss");
const safeParser = require("postcss-safe-parser");
const csstree = require("css-tree");
const { parse } = require("@babel/parser");
const babelTraverse = require("@babel/traverse").default;

router.post("/validate", async (req, res) => {
  const { html, css, js, TestCases } = req.body;
  console.log(css);
  let validationErrors = [];
  let warnings = [];
  const selectorMap = new Map();
  try {
    
    // Parse and validate the CSS with csstree
    csstree.parse(css, {
      onParseError: (error) => {
        validationErrors.push(error.message);
      },
    });

    // **Custom Checks for Common Errors**
    // Check for missing braces
    const braceCount =
      (css.match(/{/g) || []).length - (css.match(/}/g) || []).length;
    if (braceCount !== 0) {
      validationErrors.push("Unmatched opening or closing brace.");
    }

    // Check for invalid display property values
    const invalidDisplay = /display\s*:\s*block-inline|inline-blockk|nonee;/g;
    if (invalidDisplay.test(css)) {
      validationErrors.push("Invalid 'display' property value detected.");
    }

    // Check for invalid hex color codes
    const invalidHexColors = /#[0-9A-Fa-f]{1,5}[^0-9A-Fa-f\s;]/g;
    if (invalidHexColors.test(css)) {
      validationErrors.push("Invalid hex color code found.");
    }

    // Check for duplicate selectors

    const ast = csstree.parse(css);
    csstree.walk(ast, {
      visit: "Rule",
      enter(node) {
        if (node.prelude) {
          const selector = csstree.generate(node.prelude).trim();
          console.log(selector);
          if (selectorMap.has(selector)) {
            selectorMap.set(selector, selectorMap.get(selector) + 1);
          } else {
            selectorMap.set(selector, 1);
          }
        }
      },
    });

    selectorMap.forEach((count, selector) => {
      console.log(count);
      if (count > 1) {
        validationErrors.push(
          `Duplicate selector '${selector}' detected ${count} times.`
        );
      }
    });

    // Check for unknown units
    const validUnits = [
      "px",
      "em",
      "rem",
      "%",
      "vh",
      "vw",
      "vmin",
      "vmax",
      "ch",
      "ex",
      "pt",
      "cm",
      "mm",
      "in",
    ];
    const unitRegex = /(\d+)([a-zA-Z]+)/g;
    let match;
    while ((match = unitRegex.exec(css)) !== null) {
      if (!validUnits.includes(match[2])) {
        validationErrors.push(`Invalid unit '${match[2]}' detected.`);
      }
    }

    if (validationErrors.length > 0) {
      console.log("Validation Errors:", validationErrors);
      return res.json({
        success: false,
        message: "CSS contains syntax errors",
        errors: validationErrors,
        warnings,
      });
    }

    console.log("CSS passed syntax validation!");

    // Process the CSS with postcss and safeParser
    const result = await postcss([
      require("postcss-reporter")({ clearReportedMessages: true }),
    ]).process(css, { parser: safeParser, from: undefined });

    if (result.messages.length > 0) {
      console.log("Warnings:", result.messages);
      return res.json({
        success: false,
        message: "CSS contains warnings",
        warnings: result.messages,
      });
    }

    console.log("CSS is valid and has no warnings!");

    // Process TestCases
    const dynamicTestCases = TestCases.map((testcase) => {
      let testFunction;

      if (testcase.includestype === "html") {
        testFunction = () => html.includes(testcase.includes);
         console.log(html)
      } else if (testcase.includestype === "css") {
        testFunction = () => css.includes(testcase.includes);
       
      } else if (testcase.includestype === "js") {
        testFunction = () => js.includes(testcase.includes);
      } else {
        // Default test function
        testFunction = () => false;
      }

      return {
        description: testcase.description,
        test: testFunction,
      };
    });

    const results = dynamicTestCases.map((testCase) => ({
      description: testCase.description,
      success: testCase.test(),
    }));

    const allTestsPassed = results.every((result) => result.success);
    const finalMessage = allTestsPassed
      ? "All tests passed!"
      : "Some tests failed. Please check the results.";




    
    // Send the final response
    return res.json({
      success: allTestsPassed,
      message: finalMessage,
      results,
      validationErrors,
    });

  } catch (error) {
    console.error("Error during validation:", error.message);
    return res.status(500).json({
      success: false,
      message: "An internal error occurred during validation.",
      error: error.message,
    });
  }
});

module.exports = router;
