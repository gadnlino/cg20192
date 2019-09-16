#!/usr/bin/env python
# coding: UTF-8
#
#  Draws a 3D polyhedron and allows the user to rotate it
#  (mouse left button and wheel).
#
#  Each polyhedron is represented by an array of lists,
#   and each list represents a 3d vertex. 
#
#  note: a m x n matrix is represented by a list of lines:
#     [[l_1] [l_2] .. [l_m]].
#  m = len(mat), n = len(mat[0]), mat(i,j) = mat[i][j]
#  
#  Intsructions for use:
#
#  1)   To change the polyhedron, use the left/right arrow keys on the keyboard.
#
#  @author Guilherme Avelino
#  @since 28/08/2019


import numpy as np
import random
try:
   from tkinter import *     # python 3
except ImportError:
   from Tkinter import *     # python 2
from math import *

def create_zero_mat(m,n):
    """Return a matrix (m x n) filled with zeros."""

    return np.zeros((m,n))

def mat_mul(mat1, mat2):
    """Return mat1 x mat2 (mat1 multiplied by mat2)."""

    return mat1@mat2

def matTrans(mat):
    """Return mat (n x m) transposed (m x n)."""

    return np.transpose(mat)

def translate(v, dx = 0, dy = 0, dz = 0):
    """Translate vector(x,y,z) by (dx,dy,dz)."""

    transl_matrix = np.array([[1., 0., 0., float(dx)],
                              [0., 1., 0., float(dy)],
                              [0.,0.,1., float(dz)],
                              [0., 0., 0., 1.]])
    v = transl_matrix@v
    v = v/v[-1]

    return v

def hom(m):
    """Homogenous coordinates for vector m."""

    return np.array([float(m[0]), float(m[1]), float(m[2]), 1.]) 

def truncate(m):
    """Projects vector m to the (x,y,0) plane."""

    return np.array([m[0],m[1]])

def scale(m, fx = 1., fy = 1., fz = 1.):
    """Scale vector m by scale s."""

    scale_matrix = np.array([[float(fx), 0., 0., 0.],
                             [0., float(fy), 0., 0.],
                             [0., 0., float(fz), 0.],
                             [0., 0., 0., 1.]])

    return scale_matrix@m

def normalize(v):
    "Normalizes vector v."

    return v/np.linalg.norm(v)

def is_visible(v):
    "Return True if a face is visible to the user."

    return v[2] > 0

def window_viewport(v, factor = (1., 1., 1.), t = (0., 0., 0.), ti = (0., 0., 0.)):
    "Maps a point from window to viewport coordinates."
    
    v = hom(v)
    v = translate(v, dx = t[0], dy = t[1], dz = t[2])  # translate to the origin
    
    #Applying severous transformations in homogeneous coordinates
    v = scale(v, fx = factor[0], fy = factor[1], fz = factor[2])

    v = translate(v, dx = ti[0] , dy = ti[1], dz = t[2]) # translate back to window center
       
    return truncate(v)

def draw_poly(p):
    """Draws a polyhedron."""

    canvas.delete(ALL) # delete all edges

    p_coords, p_faces, p_faces_col = p[0], p[1], p[2]
    
    w = canvas.winfo_width()/2
    h = canvas.winfo_height()/2
    nf = len(p_faces)
    nv = len(p_coords)

    s = min(canvas.winfo_width(), canvas.winfo_height())
    factor = (s/4., s/4., 1.)

    poly_centr = sum(p_coords)/nv

    #Defining translation parameters
    t = (-poly_centr[0], -poly_centr[1], -poly_centr[2]) #to the origin
    t_inv = (w - poly_centr[0], h - poly_centr[1], -poly_centr[2]) #to the middle of the window

    poly_centr_vp = window_viewport(poly_centr, factor = factor, t = t, ti = t_inv)
    
    #Filling centroid on the screen
    #canvas.create_oval(poly_centr_vp[0]-1,poly_centr_vp[1]-5,poly_centr_vp[0]+5,poly_centr_vp[1]+1, fill = "red")

    #drawing normal vectors and filling faces
    for i in range(nf):

        f = p_faces[i]

        f_points = [ p_coords[f[i]] for i in range(len(f)) ]

        p1 = f_points[0]
        p2 = f_points[1]
        p3 = f_points[2]

        f_centr = sum(f_points)/len(f_points)
        
        dif = poly_centr-f_centr
        dif_t = window_viewport(normalize(dif), factor, t = t, ti = t_inv)

        v1 = p2 - p1
        v2 = p3 - p1

        perp = np.cross(v1,v2)
        perp = normalize(perp)

        # setting the perp vector orientation to be the same for all faces
        perp = perp if perp@dif < 0 else -perp

        if(is_visible(perp)):
            
            f_points_t = [ window_viewport(p, factor = factor, t = t, ti = t_inv) for p in f_points ]
            a = window_viewport(f_centr, factor = factor, t = t, ti = t_inv)
            b = window_viewport(f_centr + 0.75*perp, factor,t = t, ti = t_inv)

            # drawing normal vector
            canvas.create_line(tuple(a), tuple(b), fill = "black", arrow = LAST)

            polygon_points = [tuple(fpt) for fpt in f_points_t]
            polygon_points.append(tuple(f_points_t[0]))
            
            canvas.create_polygon(polygon_points,fill = p_faces_col[i], outline = "black", width = 2)
               
def init_poly():
    """Initialize polyhedra as a global variable."""

    gr = (1.0 + sqrt(5))/2.0

    #Tetrahedron
    tet_points = np.array([[0,-1,0],[-1,1,0],[1,1,0],[0,0,2]])
    tet_faces = np.array([[0,1,2],[0,2,3],[0,3,1],[2,1,3]])
    tet_faces_col = random.choices(COLORS, k = len(tet_faces))

    #Hexahedron or Cube
    cube_points = np.array([[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1],
                        [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1]])
    cube_faces = np.array([[0,1,2,3],[4,0,1,5],[1,2,6,5],[0,3,7,4],[4,5,6,7],[2,3,7,6]])
    cube_faces_col = random.choices(COLORS, k = len(cube_faces))

    #Octahedron
    oct_points = np.array([[-1,0,0],[0,0,-1],[1,0,0],[0,0,1],[0,1,0],[0,-1,0]])
    oct_faces = np.array([[0,1,4],[0,3,4],[2,3,4],[1,2,4],[0,1,5],[0,3,5],[2,3,5],[1,2,5]])
    oct_faces_col = random.choices(COLORS, k = len(oct_faces))

    #Dodecahedron
    dod_points = np.array([[1,1,1], [1,1,-1], [1,-1,1], [1,-1,-1],
                            [-1,1,1], [-1,1,-1], [-1,-1,1], [-1,-1,-1],
                            [0,1.0/gr,gr], [0,-1.0/gr,gr], [0,-1.0/gr,-gr], [0,1.0/gr,-gr],
                            [1.0/gr,gr,0], [-1.0/gr,gr,0], [-1.0/gr,-gr,0], [1.0/gr,-gr,0],
                            [gr,0,1.0/gr], [-gr,0,1.0/gr], [-gr,0,-1.0/gr], [gr,0,-1.0/gr]])
    dod_faces = np.array([[0,16,2,9,8],[8,4,13,12,0],[4,17,6,9,8],[9,6,14,15,2],
                         [2,16,19,3,15],[0,12,1,19,16],[12,13,5,11,1],[4,17,18,5,13],
                            [17,18,7,14,6],[14,7,10,3,15],[5,18,7,10,11],[3,19,1,11,10]])
    dod_faces_col = random.choices(COLORS, k = len(dod_faces))

    #Icosahedron
    ico_points = np.array([[1,0,gr],[1,0,-gr],[-1,0,gr],[-1,0,-gr],
                            [0,gr,1],[0,-gr,1],[0,-gr,-1],[0,gr,-1],
                            [gr,1,0],[gr,-1,0],[-gr,1,0],[-gr,-1,0]])
    ico_faces = np.array([[2,4,0],[2,0,5],[4,0,8],[0,8,9],[0,9,5],
                            [6,5,11],[6,5,9],[6,9,1],[6,1,3],[6,3,11],
                            [1,9,8],[8,1,7],[7,1,3],[3,7,10],[10,3,11],
                            [11,10,2],[2,11,5],[10,2,4],[10,7,4],[7,8,4]])
    ico_faces_col = random.choices(COLORS, k = len(ico_faces))

    global polys
    polys = [[tet_points, tet_faces, tet_faces_col],
            [cube_points, cube_faces, cube_faces_col],
            [oct_points, oct_faces, oct_faces_col],
            [dod_points, dod_faces, dod_faces_col],
            [ico_points, ico_faces, ico_faces_col]]

def init():
    """Initialize global variables."""

    global ROT_X, ROT_Y, ROT_Z
    global eps, EPS
    global lastX, lastY, poly_color, bg_color
    global COLORS
    global polys, poly_idx
    
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
    poly_color = 'red'
    bg_color = 'white'

    init_poly()
    poly_idx = random.randint(0, len(polys) - 1)


def cb_clicked(event):
    """Save current mouse position."""

    global lastX, lastY

    lastX = event.x
    lastY = event.y

def cb_mottion(event):
    """Map mouse displacements in Y direction to rotations about X axis,
       and mouse displacements in X direction to rotations about Y axis.""" 

    global polys
    p = polys[poly_idx]

    # Y coordinate is upside down
    dx = lastY - event.y 
    #print(p)
    p[0] = mat_mul(p[0], ROT_X(EPS(-dx)))

    dy = lastX - event.x
    p[0] = mat_mul(p[0], ROT_Y(EPS(dy)))

    draw_poly(p)
    cb_clicked(event)   

def wheel_up(event):
   # print("scroll pra cima")
    """Map mouse wheel up displacements to rotations about Z axis."""

    global polys
    p = polys[poly_idx]

    p[0] = mat_mul(p[0], ROT_Z(EPS(10)))
    draw_poly(p)

def wheel_down(event):
    #print("scroll pra baixo")
    """Map mouse wheel down displacements to rotations about Z axis."""

    global polys
    p = polys[poly_idx]

    p[0] = mat_mul(p[0], ROT_Z(EPS(-10)))
    draw_poly(p)

def wheel(event):
    #print("scroll")
    """Map mouse wheel displacements to rotations about Z axis."""

    global polys
    p = polys[poly_idx]

    p[0] = mat_mul(p[0], ROT_Z(EPS(event.delta/120)))
    draw_poly(p)

def resize(event):
    """Redraw the tetrahedron, in case of a window change due to user resizing it.""" 
    global polys
    p = polys[poly_idx]

    draw_poly(p)

def right_arrow(event):
    """Changes the polyedron to be displayed."""
    global polys,poly_idx
    
    poly_idx = (poly_idx + 1)%len(polys)
    
    p = polys[poly_idx]

    draw_poly(p)

def left_arrow(event):
    """Changes the polyedron to be displayed."""
    global polys,poly_idx

    poly_idx = (poly_idx - 1)%len(polys)

    p = polys[poly_idx]

    draw_poly(p)
    

def main():
    global canvas
    root = Tk()
    root.title('Platonic Solids')
    root.geometry('+0+0')

    init()

    canvas = Canvas(root, width=400, height=400, background=bg_color)
    canvas.pack(fill=BOTH,expand=YES)               
    canvas.bind("<Button-1>", cb_clicked)
    canvas.bind("<B1-Motion>", cb_mottion)
    canvas.bind("<Configure>", resize)
    canvas.bind("<Left>", left_arrow)
    canvas.bind("<Right>", right_arrow)

    from platform import uname
    os = uname()[0]
    if ( os == "Linux" ):
         canvas.bind('<Button-4>', wheel_up)      # X11
         canvas.bind('<Button-5>', wheel_down)
    elif ( os == "Darwin" ):
         canvas.bind('<MouseWheel>', wheel)      # MacOS
    else: 
         canvas.bind_all('<MouseWheel>', wheel)  # windows

    canvas.focus_set()

    p = polys[poly_idx]

    draw_poly(p)

    mainloop()

if __name__=='__main__':
    sys.exit(main())
