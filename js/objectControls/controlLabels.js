function createTextLabel(){

    let div = document.createElement('div');
    div.className = 'text-label';
    div.style.position = 'absolute';
    div.style.width = 20;
    div.style.height = 20;
    div.innerHTML = "hi there!";
    div.style.top = -1000;
    div.style.left = -1000;
    div.style.color = "aliceblue";
        
    return {

      element: div,
      parent: false,
      position: new THREE.Vector3(0,0,0),
      setHTML: function(html) {
        this.element.innerHTML = html;
        this.setId(html);
      },
      setParent : function(threejsobj) {
        this.parent = threejsobj;
      },
      setPosition : function(x,y,z){
        this.position.set(x, y, z);
      },
      setId : function(id){
        this.element.id = id;
      },
      updatePosition: function() {
        
        this.element.style.left = this.position.x + 'px';
        this.element.style.top = this.position.y + 'px';
      }
    };
};

function pushControlPointLabel(labelText, [x,y,z]){

    const offsetX = 2.3, offsetY = 2.3, offsetZ = 0;

    let labelElement = createTextLabel();
    labelElement.setHTML(labelText);
    labelElement.setParent(canvasContainer);
    labelElement.setPosition(x + offsetX, y + offsetY, z + offsetZ);
    labelElement.updatePosition();

    controlPointsLabels.push(labelElement);
}

function popControlPointLabel(){

    const lastLabel = controlPointsLabels.pop();

    canvasContainer.removeChild(lastLabel.element);
}

function popAllControlPointsLabels(){

    while(controlPointsLabels.length > 0){
        popControlPointLabel();
    }
}