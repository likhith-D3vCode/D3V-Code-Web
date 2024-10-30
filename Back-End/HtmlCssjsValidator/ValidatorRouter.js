const express=require('express');
const router=express.Router();

router.post("/validate",(req, res) => {
    const { html, css, js, TestCases } = req.body;
  
   const dynamicTestCases=TestCases.map((testcase)=>{
      let testFunction;

    
      if(testcase.includetype==='html'){
        testFunction=()=>html.includes(testcase.includes);

      }else if(testcase.includetype==='css'){
        testFunction=()=>css.includes(testcase.includes);
      }else if(testcase.includetype==='js'){
        testFunction=()=>js.includes(testcase.includes);
      }else {
        // Assign a default function to avoid undefined test functions
        testFunction = () => false;
      }

      return {
        description: testcase.description,
        test: testFunction,
      };

   });
  
    const results = dynamicTestCases.map(testCase => ({
      description: testCase.description,
      success: testCase.test(),
    }));
  
    const success = results.every(result => result.success);
    const message = success ? "All tests passed!" : "Some tests failed. Please check the console.";
  
    res.json({ success, message, results });
  });
  



  module.exports=router;