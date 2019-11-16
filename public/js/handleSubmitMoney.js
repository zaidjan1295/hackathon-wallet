const handleSendMoney = async () => {
    let id = document.getElementById("id").value;
    let eth = document.getElementById("eth").value;
    const response = await axios.post('http://localhost:8000/setNotifications', {
        sid: id, eth, tid:'rupam',
    }) 
    console.log("response", response);
}