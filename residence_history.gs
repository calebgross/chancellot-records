
// Check to see if a resident is graduating in the given year.
function isGraduating(residentName, currentYear)
{
  var ss         = SpreadsheetApp.getActiveSpreadsheet();
  var classes    = ss.getRangeByName('classes').getValues();
  var full_names = ss.getRangeByName('full_names').getValues();
  var splitName  = residentName.split(" ").reverse();
  
  // Locate resident's entry row in "Contact Info" sheet; compare against specified year.
  for(var row = 0; row < full_names.length; row++)
    if (full_names[row][0].valueOf() == splitName[0] && full_names[row][1].valueOf() == splitName[1])
      if (classes[row] == currentYear)
        return true;
      else
        break;

  return false;
}


// Get starting row index of specified year.
function getYearRow(year, residenceHistory)
{
  for (var row = 0; row < residenceHistory.length; row++)
    if (residenceHistory[row][0] == year)
      return row;
  
  return -1;
}


// Check to see if the given resident is leaving Chancellot.
function isStaying(residentName, nextYear, residenceHistory)
{
  var nextYearRow = getYearRow(nextYear, residenceHistory);
  
  // If next year not yet recorded, act as if they are returning.
  if (nextYearRow < 0)
    return true;
  
  // Check each row for resident name. 
  for (var row = nextYearRow; row < residenceHistory.length; row++)
    if (residenceHistory[row].join("#").indexOf(residentName) >= 0) 
      return true;
  
  return false;
}


// Check to see if the given resident has previously lived at Chancellot.
function isPreviousResident(residentName, currentYear, residenceHistory)
{  
  var currentYearRow = getYearRow(currentYear, residenceHistory);

  // Check each row for resident name.   
  for (var row = 0; row < currentYearRow; row++)
    if (residenceHistory[row].join("#").indexOf(residentName) >= 0) 
      return true;
  
  return false;
}


// Create an visual indicator showing a resident's status.
function getResidentStatus(residentName, year)
{
  var residentStatus = "";
  
  // Cache Residence History page for use in subsequent functions.
  var residenceHistory = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Residence History").getDataRange().getValues();
  
  // Check for new residency.
  if (!isPreviousResident(residentName, year, residenceHistory))
    residentStatus += "+";
  
  // Check if graduating.
  if (isGraduating(residentName, year)) {
    if (residentStatus.length)
      residentStatus += "/";
    residentStatus += "✕";
  }
  
  // Check if leaving.
  else if (!isStaying(residentName, year + 1, residenceHistory)) {
    if (residentStatus.length)
      residentStatus += "/";
    residentStatus += "-";
  }
  
  return residentStatus;
}
