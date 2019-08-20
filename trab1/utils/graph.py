class Graph:

    def __init__(self,n):
        self.lista_arestas = set()

    def get_lista_arestas(self):
        ret = []
        for e in self.lista_arestas:
            ret.append(e)

        return ret

    def append_if_not_exists(self, u,v):
        e1 = (u,v)
        e2 = (v,u)
        if(not ({e1}).issubset(self.lista_arestas) and 
                not ({e2}).issubset(self.lista_arestas)):
            self.lista_arestas.add(e1)
