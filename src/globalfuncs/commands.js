let debug = []

function add_command(command){debug.push(`${now_string()} - <span style="color:blue">${command} Ran!</span>`)
}

function add_error(command, error){
    debug.push(`${now_string()} - <span style="color:red">${command}<br/> ${error}<span>`)
}

function now_string(){
    let now = new Date()
    return `${now.getMonth()}/${now.getDate()}/${now.getFullYear()} - ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
}

function to_html(){
    return `<!DOCTYPE html>
<html>
    <head>
        <title>Admin Debug Log</title>
    </head>
    <body>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script>
            function send(){
                data = document.getElementById("status").value
                $.ajax({
                    url: 'http://localhost:8080/api',
                    type: 'POST',
                    headers: {
                        type: 'status',
                        status: data
                    }
                })
            }
        </script>
        <input id="status">
        <button onclick = "send()">Set Status</button>
        <hr/>
        ${debug.join('<br/>')}
    </body>
</html>`
}

module.exports = {
    debug,
    add_command,
    add_error,
    to_html,
    now_string
}