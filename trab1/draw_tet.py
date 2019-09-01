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

        if(is_visible(perp)):

            p1_t = truncate(translate(hom(p1), w, h))
            p2_t = truncate(translate(hom(p2), w, h))
            p3_t = truncate(translate(hom(p3), w, h))
            centr_t = truncate(translate(hom(centr), w, h))
            norm_t = truncate(translate(hom(centr + 100*perp), w, h))

            canvas.create_line(tuple(centr_t),
                               tuple(norm_t), fill = "black", arrow = LAST)
            #print("{x} are visible".format(x = perp))

            polygon_points = [tuple(p1_t),tuple(p2_t),tuple(p3_t),tuple(p1_t)]

            if(faces_col[i] == ""):
                faces_col[i] = random.choice(COLORS) 
            
            canvas.create_polygon(polygon_points,fill = faces_col[i], outline = "black", width = 2)
        else:
            if(faces_col[i] != ""):
                faces_col[i] = ""
            
            #print(perp)

    #print()  

def init():
    """Initialize global variables."""

    global ROT_X, ROT_Y, ROT_Z
    global eps, EPS, tet, tet_faces,faces_col
    global lastX, lastY, tetColor, bgColor
    global COLORS

    tet = np.array([[0.,-100.,0.],[-100.,100.,0.],[100.,100.,0.],[0.,0.,200.]])
    tet_faces = np.array([[0,1,2],[0,2,3],[0,3,1],[2,1,3]])
    faces_col = [""]*len(tet_faces)
    
    COLORS = ['snow', 'ghost white', 'white smoke', 'gainsboro', 'floral white', 'old lace',
    'linen', 'antique white', 'papaya whip', 'blanched almond', 'bisque', 'peach puff',
    'navajo white', 'lemon chiffon', 'mint cream', 'azure', 'alice blue', 'lavender',
    'lavender blush', 'misty rose', 'dark slate gray', 'dim gray', 'slate gray',
    'light slate gray', 'gray', 'light grey', 'midnight blue', 'navy', 'cornflower blue', 'dark slate blue',
    'slate blue', 'medium slate blue', 'light slate blue', 'medium blue', 'royal blue',  'blue',
    'dodger blue', 'deep sky blue', 'sky blue', 'light sky blue', 'steel blue', 'light steel blue',
    'light blue', 'powder blue', 'pale turquoise', 'dark turquoise', 'medium turquoise', 'turquoise',
    'cyan', 'light cyan', 'cadet blue', 'medium aquamarine', 'aquamarine', 'dark green', 'dark olive green',
    'dark sea green', 'sea green', 'medium sea green', 'light sea green', 'pale green', 'spring green',
    'lawn green', 'medium spring green', 'green yellow', 'lime green', 'yellow green',
    'forest green', 'olive drab', 'dark khaki', 'khaki', 'pale goldenrod', 'light goldenrod yellow',
    'light yellow', 'yellow', 'gold', 'light goldenrod', 'goldenrod', 'dark goldenrod', 'rosy brown',
    'indian red', 'saddle brown', 'sandy brown',
    'dark salmon', 'salmon', 'light salmon', 'orange', 'dark orange',
    'coral', 'light coral', 'tomato', 'orange red', 'red', 'hot pink', 'deep pink', 'pink', 'light pink',
    'pale violet red', 'maroon', 'medium violet red', 'violet red',
    'medium orchid', 'dark orchid', 'dark violet', 'blue violet', 'purple', 'medium purple',
    'thistle', 'snow2', 'snow3',
    'snow4', 'seashell2', 'seashell3', 'seashell4', 'AntiqueWhite1', 'AntiqueWhite2',
    'AntiqueWhite3', 'AntiqueWhite4', 'bisque2', 'bisque3', 'bisque4', 'PeachPuff2',
    'PeachPuff3', 'PeachPuff4', 'NavajoWhite2', 'NavajoWhite3', 'NavajoWhite4',
    'LemonChiffon2', 'LemonChiffon3', 'LemonChiffon4', 'cornsilk2', 'cornsilk3',
    'cornsilk4', 'ivory2', 'ivory3', 'ivory4', 'honeydew2', 'honeydew3', 'honeydew4',
    'LavenderBlush2', 'LavenderBlush3', 'LavenderBlush4', 'MistyRose2', 'MistyRose3',
    'MistyRose4', 'azure2', 'azure3', 'azure4', 'SlateBlue1', 'SlateBlue2', 'SlateBlue3',
    'SlateBlue4', 'RoyalBlue1', 'RoyalBlue2', 'RoyalBlue3', 'RoyalBlue4', 'blue2', 'blue4',
    'DodgerBlue2', 'DodgerBlue3', 'DodgerBlue4', 'SteelBlue1', 'SteelBlue2',
    'SteelBlue3', 'SteelBlue4', 'DeepSkyBlue2', 'DeepSkyBlue3', 'DeepSkyBlue4',
    'SkyBlue1', 'SkyBlue2', 'SkyBlue3', 'SkyBlue4', 'LightSkyBlue1', 'LightSkyBlue2',
    'LightSkyBlue3', 'LightSkyBlue4', 'SlateGray1', 'SlateGray2', 'SlateGray3',
    'SlateGray4', 'LightSteelBlue1', 'LightSteelBlue2', 'LightSteelBlue3',
    'LightSteelBlue4', 'LightBlue1', 'LightBlue2', 'LightBlue3', 'LightBlue4',
    'LightCyan2', 'LightCyan3', 'LightCyan4', 'PaleTurquoise1', 'PaleTurquoise2',
    'PaleTurquoise3', 'PaleTurquoise4', 'CadetBlue1', 'CadetBlue2', 'CadetBlue3',
    'CadetBlue4', 'turquoise1', 'turquoise2', 'turquoise3', 'turquoise4', 'cyan2', 'cyan3',
    'cyan4', 'DarkSlateGray1', 'DarkSlateGray2', 'DarkSlateGray3', 'DarkSlateGray4',
    'aquamarine2', 'aquamarine4', 'DarkSeaGreen1', 'DarkSeaGreen2', 'DarkSeaGreen3',
    'DarkSeaGreen4', 'SeaGreen1', 'SeaGreen2', 'SeaGreen3', 'PaleGreen1', 'PaleGreen2',
    'PaleGreen3', 'PaleGreen4', 'SpringGreen2', 'SpringGreen3', 'SpringGreen4',
    'green2', 'green3', 'green4', 'chartreuse2', 'chartreuse3', 'chartreuse4',
    'OliveDrab1', 'OliveDrab2', 'OliveDrab4', 'DarkOliveGreen1', 'DarkOliveGreen2',
    'DarkOliveGreen3', 'DarkOliveGreen4', 'khaki1', 'khaki2', 'khaki3', 'khaki4',
    'LightGoldenrod1', 'LightGoldenrod2', 'LightGoldenrod3', 'LightGoldenrod4',
    'LightYellow2', 'LightYellow3', 'LightYellow4', 'yellow2', 'yellow3', 'yellow4',
    'gold2', 'gold3', 'gold4', 'goldenrod1', 'goldenrod2', 'goldenrod3', 'goldenrod4',
    'DarkGoldenrod1', 'DarkGoldenrod2', 'DarkGoldenrod3', 'DarkGoldenrod4',
    'RosyBrown1', 'RosyBrown2', 'RosyBrown3', 'RosyBrown4', 'IndianRed1', 'IndianRed2',
    'IndianRed3', 'IndianRed4', 'sienna1', 'sienna2', 'sienna3', 'sienna4', 'burlywood1',
    'burlywood2', 'burlywood3', 'burlywood4', 'wheat1', 'wheat2', 'wheat3', 'wheat4', 'tan1',
    'tan2', 'tan4', 'chocolate1', 'chocolate2', 'chocolate3', 'firebrick1', 'firebrick2',
    'firebrick3', 'firebrick4', 'brown1', 'brown2', 'brown3', 'brown4', 'salmon1', 'salmon2',
    'salmon3', 'salmon4', 'LightSalmon2', 'LightSalmon3', 'LightSalmon4', 'orange2',
    'orange3', 'orange4', 'DarkOrange1', 'DarkOrange2', 'DarkOrange3', 'DarkOrange4',
    'coral1', 'coral2', 'coral3', 'coral4', 'tomato2', 'tomato3', 'tomato4', 'OrangeRed2',
    'OrangeRed3', 'OrangeRed4', 'red2', 'red3', 'red4', 'DeepPink2', 'DeepPink3', 'DeepPink4',
    'HotPink1', 'HotPink2', 'HotPink3', 'HotPink4', 'pink1', 'pink2', 'pink3', 'pink4',
    'LightPink1', 'LightPink2', 'LightPink3', 'LightPink4', 'PaleVioletRed1',
    'PaleVioletRed2', 'PaleVioletRed3', 'PaleVioletRed4', 'maroon1', 'maroon2',
    'maroon3', 'maroon4', 'VioletRed1', 'VioletRed2', 'VioletRed3', 'VioletRed4',
    'magenta2', 'magenta3', 'magenta4', 'orchid1', 'orchid2', 'orchid3', 'orchid4', 'plum1',
    'plum2', 'plum3', 'plum4', 'MediumOrchid1', 'MediumOrchid2', 'MediumOrchid3',
    'MediumOrchid4', 'DarkOrchid1', 'DarkOrchid2', 'DarkOrchid3', 'DarkOrchid4',
    'purple1', 'purple2', 'purple3', 'purple4', 'MediumPurple1', 'MediumPurple2',
    'MediumPurple3', 'MediumPurple4', 'thistle1', 'thistle2', 'thistle3', 'thistle4',
    'gray1', 'gray2', 'gray3', 'gray4', 'gray5', 'gray6', 'gray7', 'gray8', 'gray9', 'gray10',
    'gray11', 'gray12', 'gray13', 'gray14', 'gray15', 'gray16', 'gray17', 'gray18', 'gray19',
    'gray20', 'gray21', 'gray22', 'gray23', 'gray24', 'gray25', 'gray26', 'gray27', 'gray28',
    'gray29', 'gray30', 'gray31', 'gray32', 'gray33', 'gray34', 'gray35', 'gray36', 'gray37',
    'gray38', 'gray39', 'gray40', 'gray42', 'gray43', 'gray44', 'gray45', 'gray46', 'gray47',
    'gray48', 'gray49', 'gray50', 'gray51', 'gray52', 'gray53', 'gray54', 'gray55', 'gray56',
    'gray57', 'gray58', 'gray59', 'gray60', 'gray61', 'gray62', 'gray63', 'gray64', 'gray65',
    'gray66', 'gray67', 'gray68', 'gray69', 'gray70', 'gray71', 'gray72', 'gray73', 'gray74',
    'gray75', 'gray76', 'gray77', 'gray78', 'gray79', 'gray80', 'gray81', 'gray82', 'gray83',
    'gray84', 'gray85', 'gray86', 'gray87', 'gray88', 'gray89', 'gray90', 'gray91', 'gray92',
    'gray93', 'gray94', 'gray95', 'gray97', 'gray98', 'gray99']

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
   # print("scroll pra cima")
    """Map mouse wheel up displacements to rotations about Z axis."""

    global tet
    tet = matMul(tet,ROT_Z(EPS(10)))
    drawTet(tet,tetColor)

def wheelDown(event):
    #print("scroll pra baixo")
    """Map mouse wheel down displacements to rotations about Z axis."""

    global tet
    tet = matMul(tet,ROT_Z(EPS(-10)))
    drawTet(tet,tetColor)

def wheel(event):
    #print("scroll")
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
