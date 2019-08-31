#!/usr/bin/env python
# coding: UTF-8
#
## @package _12_tet
#
#  Draws a 3D tetrahedron and allows a user to rotate it
#  (mouse left button and wheel).
#
#  The Tetrahedron is represented by a 3 x 4 matrix. 
#  Each column represents a 3D vertex.
#
#  note: a m x n matrix is represented by a list of lines:
#     [[l_1] [l_2] .. [l_m]].
#  m = len(mat), n = len(mat[0]), mat(i,j) = mat[i][j]
#
#  @author Guilherme Avelino
#  @since 28
#  @see http://www.orimosenzon.com/wiki/index.php/Python_samples
#  @see http://mathworld.wolfram.com/RotationMatrix.html


import numpy as np
import random
try:
   from tkinter import *     # python 3
except ImportError:
   from Tkinter import *     # python 2
from math import *

def createZeroMat(m,n):
    """Return a matrix (m x n) filled with zeros."""

    return np.zeros((m,n))

def matMul(mat1, mat2):
    """Return mat1 x mat2 (mat1 multiplied by mat2)."""

    return mat1@mat2

def matTrans(mat):
    """Return mat (n x m) transposed (m x n)."""

    return np.transpose(mat)

def translate(v,dx,dy):
    """Translate vector(x,y) by (dx,dy)."""

    #matriz de translação em coordenadas homogeneas
    transl_matrix = np.array([[1.,0.,dx],[0.,1.,dy],[0.,0.,1.]])

    return transl_matrix@v

def hom(m):
    """Homogenous coordinates for vector m."""
    return np.array([m[0],m[1],1.]) 

def truncate(m):
    """Projects vector m to the (x,y,0) plane."""
    return np.array([m[0],m[1]])

def is_visible(v):
    
    return v[2] > 0

def drawTet(tet,col):
    """Draw a tetrahedron."""

    w = canvas.winfo_width()/2
    h = canvas.winfo_height()/2
    canvas.delete(ALL) # delete all edges
    nv = len(tet)   # number of vertices in tet (4)

    # draw the 6 edges of the tetrahedron
    for p1 in range(nv):
        for p2 in range(p1+1,nv):
            
            canvas.create_line(tuple(truncate(translate(hom(tet[p1]), w, h))),
                               tuple(truncate(translate(hom(tet[p2]), w, h))), fill = col)


    nf = len(tet_faces)

    #drawing normal vectors and filling faces
    for i in range(nf):
        f = tet_faces[i]

        p1 = tet[f[0]]
        p2 = tet[f[1]]
        p3 = tet[f[2]]

        centr = (p1 + p2 + p3)/3
        
        v1 = p2 - p1
        v2 = p3 - p1

        perp = np.cross(v1,v2)
        perp = perp / np.linalg.norm(perp)
       
        colors = ["red","green","blue","yellow","orange","gray","purple"]

        if(is_visible(perp)):

            p1_t = truncate(translate(hom(p1), w, h))
            p2_t = truncate(translate(hom(p2), w, h))
            p3_t = truncate(translate(hom(p3), w, h))
            centr_t = truncate(translate(hom(centr), w, h))
            norm_t = truncate(translate(hom(centr + 100*perp), w, h))

            canvas.create_line(tuple(centr_t),
                               tuple(norm_t), fill = "black", arrow = LAST)
            print("{x} are visible".format(x = perp))

            polygon_points = [tuple(p1_t),tuple(p2_t),tuple(p3_t),tuple(p1_t)]
            canvas.create_polygon(polygon_points,fill = random.choice(colors), outline = "black", width = 3)
        else:
             print(perp)

    print()  

def init():
    """Initialize global variables."""

    global ROT_X, ROT_Y, ROT_Z
    global eps, EPS, tet, tet_faces
    global lastX, lastY, tetColor, bgColor

    tet = np.array([[0.,-100.,0.],[-100.,100.,0.],[100.,100.,0.],[0.,0.,200.]])
    tet_faces = np.array([[0,1,2],[0,2,3],[0,3,1],[2,1,3]])

    # counter-clockwise rotation about the X axis
    ROT_X = lambda x: np.array([[1,0,0],[0,cos(x),-sin(x)], [0,sin(x),cos(x)]])

    # counter-clockwise rotation about the Y axis
    ROT_Y = lambda y: np.array([[cos(y),0,sin(y)], [0,1,0],[-sin(y),0,cos(y)]])

    # counter-clockwise rotation about the Z axis
    ROT_Z = lambda z: np.array([[cos(z),sin(z),0], [-sin(z),cos(z),0], [0,0,1]])

    eps = lambda d: pi/300 if (d>0) else -pi/300
    EPS = lambda d: d*pi/300

    lastX = 0 
    lastY = 0
    tetColor = 'red'
    bgColor = 'white'

def cbClicked(event):
    """Save current mouse position."""

    global lastX, lastY

    lastX = event.x
    lastY = event.y

def cbMottion(event):
    """Map mouse displacements in Y direction to rotations about X axis,
       and mouse displacements in X direction to rotations about Y axis.""" 

    global tet

    # Y coordinate is upside down
    dx = lastY - event.y 
    tet = matMul(tet,ROT_X(EPS(-dx)))

    dy = lastX - event.x
    tet = matMul(tet,ROT_Y(EPS(dy)))

    drawTet(tet,tetColor)
    cbClicked(event)   

def wheelUp(event):
    """Map mouse wheel up displacements to rotations about Z axis."""

    global tet
    tet = matMul(tet,ROT_Z(EPS(event.delta/120)))
    drawTet(tet,tetColor)

def wheelDown(event):
    """Map mouse wheel down displacements to rotations about Z axis."""

    global tet
    tet = matMul(tet,ROT_Z(EPS(event.delta/120)))
    drawTet(tet,tetColor)

def wheel(event):
    """Map mouse wheel displacements to rotations about Z axis."""

    global tet
    tet = matMul(tet,ROT_Z(EPS(event.delta/120)))
    drawTet(tet,tetColor)

def resize(event):
    """Redraw the tetrahedron, in case of a window change due to user resizing it.""" 

    drawTet(tet,tetColor)
                
def main():
    global canvas
    root = Tk()
    root.title('Tetrahedron')
    root.geometry('+0+0')

    init()

    canvas = Canvas(root, width=400, height=400, background=bgColor)
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

    drawTet(tet,tetColor)

    mainloop()

if __name__=='__main__':
    sys.exit(main())
