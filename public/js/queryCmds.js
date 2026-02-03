//=====================================================================================
// FETCH METHOD
// This function uses the fetch API to make a request to the server.
//=====================================================================================
function fetchMethod(url, callback, method = "GET", data = null, token = null) {
    // Auto-inject token from localStorage if not provided
    const authToken = token || localStorage.getItem('token');

    console.log(`fetchMethod [${method}]: ${url}`, { data, hasToken: !!authToken });

    const headers = {};

    if (data) {
        headers["Content-Type"] = "application/json";
    }

    if (authToken) {
        headers["Authorization"] = "Bearer " + authToken;
    }

    let options = {
        method: method.toUpperCase(),
        headers: headers
    };

    if (method.toUpperCase() !== "GET" && data !== null) {
        options.body = JSON.stringify(data);
    }

    fetch(url, options)
        .then((response) => {
            if (response.status === 204) {
                return callback(response.status, {});
            }

            // Attempt to parse JSON, handle non-JSON responses gracefully
            response.text().then(text => {
                let responseData = {};
                try {
                    responseData = JSON.parse(text);
                } catch (e) {
                    console.warn("Response is not JSON:", text);
                    responseData = { message: text };
                }

                // Standardize error reporting for the callback
                if (!response.ok && !responseData.message && !responseData.error) {
                    responseData.message = `Request failed with status ${response.status}`;
                }

                callback(response.status, responseData);
            });
        })
        .catch((error) => {
            console.error(`Network Error from ${method} ${url}: `, error);
            callback(0, { message: "Network error or server unavailable" });
        });
}

//=====================================================================================
// JQUERY METHOD
// This function uses the jQuery ajax method to make a request to the server.
//=====================================================================================


//=====================================================================================
// AXIOS METHOD
// This function uses the axios method to make a request to the server.
//=====================================================================================
