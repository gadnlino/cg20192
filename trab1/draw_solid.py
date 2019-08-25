#!/usr/bin/env python
# coding: UTF-8
#
#  Draws a 3D solid and allows a user to rotate it
#  (mouse left button and wheel).
# 
#  Each row represents a 3D vertex.
#
#  note: a m x n matrix is represented by a list of lines:
#     [[l_1] [l_2] .. [l_m]].
#  m = len(mat), n = len(mat[0]), mat(i,j) = mat[i][j]
#
#  @author Guilherme Avelino
#  @since 19/08/2019

try:
   from tkinter import *     # python 3
except ImportError:
   from Tkinter import *     # python 2
from math import *
import numpy as np
import csv
from utils.graph import Graph
from utils.polygon import Polygon

def init():
    """Initialize global variables."""

    global ROT_X, ROT_Y, ROT_Z
    global eps, EPS
    global solid, solid_graph
    global lastX, lastY, solid_color, bg_color
    global factor

    factor = 100
    solid = scale(read_solid("tetrahedron"),factor)

    # counter-clockwise rotation about the X axis
    ROT_X = lambda x: np.transpose(np.array([[1.,0.,0.],
                                             [0.,cos(x),-sin(x)],
                                             [0.,sin(x),cos(x)]]))
    #ROT_X = lambda x: matTrans([[1,0,0],           [0,cos(x),-sin(x)], [0,sin(x),cos(x)] ])

    # counter-clockwise rotation about the Y axis
    ROT_Y = lambda y: np.transpose(np.array([[cos(y),0.,sin(y)],
                                             [0.,1.,0.],
                                             [-sin(y),0.,cos(y)]]))
    #ROT_Y = lambda y: matTrans([[cos(y),0,sin(y)], [0,1,0],            [-sin(y),0,cos(y)]])

    # counter-clockwise rotation about the Z axis
    ROT_Z = lambda z: np.transpose(np.array([[cos(z),sin(z),0.],
                                             [-sin(z),cos(z),0.],
                                             [0.,0.,1.]]))
    #ROT_Z = lambda z: matTrans([[cos(z),sin(z),0], [-sin(z),cos(z),0], [0,0,1]])

    eps = lambda d: pi/300 if (d>0) else -pi/300
    EPS = lambda d: d*pi/300

    lastX = 0 
    lastY = 0
    solid_color = 'white'
    bg_color = 'black'

def createZeroMat(m,n):
    """Return a matrix (m x n) filled with zeros."""

    return np.zeros((m,n))

def translate(vec,dx,dy):
    """Translate vector(x,y) by (dx,dy)."""

    return x+dx, y+dy

def dist(p1,p2):
    """Computes the distance between two points."""
    diff = p1-p2
    return diff@diff

def scale(solid,factor):

    return solid@(np.array([[factor,0.,0.],
                            [0.,factor,0.],
                            [0.,0.,factor]]))

def project(point,axis):
    """Projects the point on the specified axis."""
    if(axis == 'x'):
        point[0] = 0
    elif(axis == 'y'):
        point[1] = 0
    elif(axis == 'z'):
        point[2] = 0
    
    return point


def draw_solid(solid,col):

    w = canvas.winfo_width()/2
    h = canvas.winfo_height()/2
    canvas.delete(ALL) # delete all edges
    nv = len(solid)   # number of vertices in tet (4)

    # draw the edges of the solid
    for p1 in range(nv):
        for p2 in range(p1+1,nv):
            p1 = project(p1,'z')
            p2 = project(p2,'z')
            canvas.create_line(translate(solid[p1][0], solid[p1][1], w, h),
                           translate(solid[p2][0], solid[p2][1], w, h), fill = col)

def read_solid(solid_name):
    """Read the solid coordinates from a csv file."""
    
    filename = "solids/" + solid_name + ".csv"
    
    points = []
    p = Polygon()

    with open(filename) as csvfile:

        readCSV = csv.reader(csvfile, delimiter=',')
        
        for row in readCSV:
            if(row[0] == 'v'):
        
                v = np.array([float(row[1]),float(row[2]),float(row[3])])
                p.append_vertice(v)

            elif(row[0] == 'f'):
                
                f = []
                for i in range(1,len(row)):
                   f.append(int(row[i]))
                p.append_face(f)

    print(p.get_faces())            
    return p.get_vertex()


########## TRATANDO EVENTOS DO MOUSE ############

def cbClicked(event):
    """Save current mouse position."""

    global lastX, lastY

    lastX = event.x
    lastY = event.y

def cbMottion(event):
    """Map mouse displacements in Y direction to rotations about X axis,
       and mouse displacements in X direction to rotations about Y axis.""" 

    global solid

    # Y coordinate is upside down
    dx = lastY - event.y 
    solid = solid@(ROT_X(EPS(-dx)))

    dy = lastX - event.x
    solid = solid@(ROT_Y(EPS(dy)))

    draw_solid(solid,solid_color)
    cbClicked(event)   

def wheelUp(event):
    """Map mouse wheel up displacements to rotations about Z axis."""

    global solid
    solid = solid@(ROT_Z(EPS(1)))
    draw_solid(solid,solid_color)

def wheelDown(event):
    """Map mouse wheel down displacements to rotations about Z axis."""

    global solid
    solid = solid@(ROT_Z(EPS(-1)))
    draw_solid(solid,solid_color)

def wheel(event):
    """Map mouse wheel displacements to rotations about Z axis."""

    global solid
    solid = solid@(ROT_Z(EPS(event.delta/120)))
    draw_solid(solid,solid_color)

def resize(event):
    """Redraw the solid, in case of a window change due to user resizing it.""" 

    draw_solid(solid,solid_color)
                
def main():
    global canvas
    root = Tk()
    root.title('Drawing Platonic Solids')
    root.geometry('+0+0')

    init()

    canvas = Canvas(root, width=400, height=400, background=bg_color)
    canvas.pack(fill=BOTH,expand=YES)               
    canvas.bind("<Button-1>", cbClicked)
    canvas.bind("<B1-Motion>", cbMottion)
    canvas.bind("<Configure>", resize)

    from platform import uname
    os = uname()[0]
    if ( os == "Linux" ):
         canvas.bind('<Button-4>', wheelUp)      # X11
         canvas.bind('<Button-5>', wheelDown)
    elif ( os == "Darwin" ):
         canvas.bind('<MouseWheel>', wheel)      # MacOS
    else: 
         canvas.bind_all('<MouseWheel>', wheel)  # windows

    draw_solid(solid,solid_color)

    mainloop()

if __name__=='__main__':
    sys.exit(main())
