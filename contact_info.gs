
// Search residence history and determine year joined.
function getYearJoined(residentName)
{  
  var residenceHistory = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Residence History").getDataRange().getValues();
  var currentYear      = "";
  
  for (var row = 0; row < residenceHistory.length; row++) {
    
    // Update current year, if applicable.
    if (String(residenceHistory[row][0]).match(/^[0-9]{4}$/))
      currentYear = residenceHistory[row][0];
   
    // Check for resident name. 
    else if (residenceHistory[row].join("#").indexOf(residentName) >= 0) 
      return currentYear;    
  }
  
  return false;
}


// Search residence history and determine year left.
function getYearLeft(residentName)
{  
  var residenceHistory = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Residence History").getDataRange().getValues();
  
  // Working backward, check for resident name. If found, keep walking back to locate the year.
  for (var row = residenceHistory.length - 1; row >= 0 ; row--) {
    if (residenceHistory[row].join("#").indexOf(residentName) >= 0) {
      while (!String(residenceHistory[row][0]).match(/^[0-9]{4}$/))
        row--;
      return residenceHistory[row][0];
    }
  }
  
  return false;
}
