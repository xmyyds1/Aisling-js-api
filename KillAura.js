let attackRange = 7.0;
let cps = 20;
let lastAttackTime = 0;
let targetAngle = null;

function getNearestPlayer(localplayer) {
    const myPos = getPos(localplayer);
    const players = getPlayerList();
    let nearest = null, minDist = Infinity;
    for (let p of players) {
        if (!isValid(p)) continue;
        const pos = getPos(p);
        const dx = pos.x - myPos.x, dy = pos.y - myPos.y, dz = pos.z - myPos.z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (dist < minDist) {
            minDist = dist;
            nearest = p;
        }
    }
    return nearest;
}

function calcAngle(from, to) {
    const dx = to.x - from.x, dy = to.y - from.y, dz = to.z - from.z;
    const yaw = Math.atan2(dz, dx) * 180 / Math.PI - 90;
    const horizontal = Math.sqrt(dx*dx + dz*dz);
    const pitch = -Math.atan2(dy, horizontal) * 180 / Math.PI;
    return {pitch, yaw};
}

function killAuraTick(localplayer) {
    const now = Date.now();
    if (now - lastAttackTime < 1000 / cps) return;

    const target = getNearestPlayer(localplayer);
    if (!target) {
        targetAngle = null;
        return;
    }

    const pos = getPos(localplayer);
    const targetPos = getPos(target);
    const dx = targetPos.x - pos.x, dy = targetPos.y - pos.y, dz = targetPos.z - pos.z;
    const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
    if (dist > attackRange) {
        targetAngle = null;
        return;
    }

    attack(target);
    swing();

    lastAttackTime = now;
    targetAngle = calcAngle(pos, targetPos);
}

registerEvent('onActorTick', function(localplayer) {
    killAuraTick(localplayer);
});

registerEvent('onDispatcherRender', function() {
    if (!targetAngle) return;
    setRot(getLocalPlayer(), targetAngle.pitch, targetAngle.yaw);
});