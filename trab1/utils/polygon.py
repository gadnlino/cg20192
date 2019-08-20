class Polygon:

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.vertex = {}
        self.faces = []
        self.tam = 0
    
    def is_empty(self):
        return self.tam == 0

    def append_vertice(self,v):
        self.vertex[self.tam] = v
        self.tam = self.tam+1
    
    def append_face(self,f):
        self.faces.append(f)

    def get_vertex(self):
        vx = []

        for v in self.vertex.items():
            vx.append(v[1])
            
        return np.array(vx)

    def get_faces(self):
        return self.faces
