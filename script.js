var csvData = {}; // Global object to store CSV data

// Function to load all CSV data files
function loadAllCSVFiles() {
    var csvURLs = [
        "https://raw.githubusercontent.com/aMmarkunwar/resultDot/main/resultDOT/semester1_results.csv",
        "https://raw.githubusercontent.com/aMmarkunwar/resultDot/main/resultDOT/semester2_results.csv",
        "https://raw.githubusercontent.com/aMmarkunwar/resultDot/main/resultDOT/semester3_results.csv",
        "https://raw.githubusercontent.com/aMmarkunwar/resultDot/main/resultDOT/semester4_results.csv",
        "https://raw.githubusercontent.com/aMmarkunwar/resultDot/main/resultDOT/semester5_results.csv",
        "https://raw.githubusercontent.com/aMmarkunwar/resultDot/main/resultDOT/semester6_results.csv",
        "https://raw.githubusercontent.com/aMmarkunwar/resultDot/main/resultDOT/semester7_results.csv",
        "https://raw.githubusercontent.com/aMmarkunwar/resultDot/main/resultDOT/semester8_results.csv"
    ];

    // Use Promise.all to fetch and parse all CSV files concurrently
    Promise.all(csvURLs.map(fetchAndParseCSV))
        .then(function (results) {
            // Store the parsed CSV data in the global object
            results.forEach(function (result, index) {
                csvData["semester" + (index + 1)] = result.data;
            });
        })
        .catch(function (error) {
            console.error("Error loading CSV files:", error);
        });
}

// Function to fetch and parse a CSV file
function fetchAndParseCSV(csvURL) {
    return new Promise(function (resolve, reject) {
        Papa.parse(csvURL, {
            header: true,
            download: true,
            skipEmptyLines: true,
            complete: resolve,
            error: reject
        });
    });
}

// Function to display the filtered data in a table with vertical alignment
function displayTable(filteredData) {
    var tableContainer = document.getElementById("tableContainer");

    // Check if the tableContainer element exists
    if (tableContainer) {
        var resultTable = "<table id='resultTable'>";
        if (filteredData.length > 0) {
            // Display the filtered data with column names and values aligned vertically
            var columnNames = Object.keys(filteredData[0]);

            // Iterate through the column names
            columnNames.forEach(function (key, columnIndex) {
                resultTable += "<tr>";
                resultTable += "<th>" + key + "</th>";

                // Check if it's the last column (SGPA column)
                var isLastColumn = columnIndex === columnNames.length - 1;

                filteredData.forEach(function (rowData, rowIndex) {
                    resultTable += "<td";

                    // If it's the last column (SGPA column), apply color based on SGPA value
                    if (isLastColumn) {
                        var sgpaValue = rowData[key].trim();
                        if (!isNaN(parseFloat(sgpaValue))) {
        resultTable += " style='color: green'";
    } else {
        resultTable += " style='color: red'";
    }
                    }

                    resultTable += ">" + rowData[key] + "</td>";
                });

                resultTable += "</tr>";
            });
        } else {
            // No data found
            resultTable += "<tr><td style='padding: 10px;'><p>No data found</p></td></tr>";
        }
        resultTable += "</table>";

        tableContainer.innerHTML = resultTable;
        tableContainer.style.display = "block"; // Always show the container
    } else {
        console.error("Element with ID 'tableContainer' not found.");
    }
}



// Function to search for and display data
function searchAndDisplay() {
    var selectedSemester = document.getElementById("semesterSelect").value;
    var searchRollNumber = parseInt(document.getElementById("searchInput").value);

    // Check if CSV data for the selected semester is available
    if (csvData["semester" + selectedSemester]) {
        var filteredData = csvData["semester" + selectedSemester].filter(function (rowData) {
            return parseInt(rowData["Roll Number"]) === searchRollNumber;
        });

        // Display the filtered data in the table with vertical alignment
        displayTable(filteredData);
    } else {
        console.error("CSV data for selected semester not available.");
    }
}

// Load all CSV data when the window loads
window.onload = function () {
    loadAllCSVFiles();
};
