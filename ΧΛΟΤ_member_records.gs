/**
 * Checks to see if a resident is graduating in the given year.
 * Author: Caleb Gross
 */
function isGraduating(residentName, currentYear) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var classes = ss.getRangeByName('classes').getValues();
  var full_names = ss.getRangeByName('full_names').getValues();
  var splitName = residentName.split(" ");
  var firstName = splitName[0];
  var lastName = splitName[1];
  var nameIndex;
  
  for(var i = 0; i < full_names.length; i++) {
    if (full_names[i][0].valueOf()==lastName)
      if (full_names[i][1].valueOf()==firstName)
        nameIndex = i;
  }

  var graduatingClass = classes[nameIndex];
  if (graduatingClass==currentYear)
    return true;
  else
    return false;
}


/**
 * Finds the row range for apartment residents of a given year.
 * Author: Caleb Gross
 */
function getAptRows(year, residenceHistory) {
  var yearColumn = getColumn(residenceHistory, 0);
  var yearIndex = -1;
  
  for (var i = 0; i < yearColumn.length; i++) {
    if (yearColumn[i]==year) {
      yearIndex = i-1;
      break;
    }
  }
  
  if (yearIndex<0)
    return false;
  else
    return [yearIndex+3, yearIndex+10];
}


/**
 * Searches a range of apartment residents for a given resident.
 * Author: Caleb Gross
 */
function searchResidenceHistory(residentName, aptRows, residenceHistory) {
  var aptColumns = [0, 2, 4];
  for (var i = 0; i < aptColumns.length; i++) {
    for (var j = aptRows[0]; j < aptRows[1]+1; j++) {
      if (residenceHistory[j][aptColumns[i]]==residentName)
        return true;
    }
  }
  return false;
}


/**
 * Checks to see if the given resident has previously lived at Chancellot.
 * Author: Caleb Gross
 */
function isPreviousResident(residentName, currentYear, residenceHistory) {
  var inauguralYear = 2012;
  
  //iterate from 2012 to previous year
  for(var i = inauguralYear; i < currentYear; i++) {
    
    //get apt range of working year
    var aptRows = getAptRows(i, residenceHistory);
    if (aptRows==false)
      return false;
    
    //locate resident columns and search them
    var isPreviousResident = searchResidenceHistory(residentName, aptRows, residenceHistory);
    if (isPreviousResident!=false)
      return isPreviousResident;
  }
  return false;
}


/**
 * Checks to see if the given resident is leaving Chancellot.
 * Author: Caleb Gross
 */
function isStaying(residentName, currentYear, residenceHistory) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nextYear = currentYear + 1;
  
  //get apt range of next year
  var aptRows = getAptRows(nextYear, residenceHistory);
  
  //if next year not yet recorded, act as if they are returning
  if (aptRows==false)
    return true;
  
  //locate resident columns and search them
  return searchResidenceHistory(residentName, aptRows, residenceHistory);
}

/**
 * Gets column of interest from 2D array.
 * Author: Caleb Gross
 */
function getColumn(array, column) {
  var desiredColumn = [];
  for (var i = 0; i < array.length; i++) {
    desiredColumn[i] = array[i][column];
  }
  return desiredColumn;
}


/**
 * Creates an visual indicator showing a resident's status.
 * Author: Caleb Gross
 */
function getResidentStatus(residentName, year) {
  var residentStatus = "";
  
  //cache Residence History page
  var residenceHistory = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Residence History");
  var lastRow = residenceHistory.getLastRow();
  var lastColumn = residenceHistory.getLastColumn();
  var residenceHistory = residenceHistory.getRange(1, 1, lastRow, lastColumn).getValues();
  
  //check for new residency
  if (!isPreviousResident(residentName, year, residenceHistory))
    residentStatus += "+";
  
  //check if graduating
  if (isGraduating(residentName, year)) {
    if (residentStatus.length)
      residentStatus += "/";
    residentStatus += "✕";
  }
  
  //check if leaving
  else if (!isStaying(residentName, year, residenceHistory)) {
    if (residentStatus.length)
      residentStatus += "/";
    residentStatus += "-";
  }
  
  return residentStatus;
}

