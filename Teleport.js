(async function() {
    let msg = await prompt("请输入坐标");
    let localplayer = getLocalPlayer();
    let [x, y, z] = msg.trim().split(/\s+/).map(Number);
    let pos = {x, y, z};
    setPos(localplayer, pos);
})();