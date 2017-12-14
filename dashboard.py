import cherrypy
import os
from jinja2 import Environment, FileSystemLoader

dashboard_dir = os.path.dirname(os.path.abspath(__file__))
env = Environment(loader=FileSystemLoader(dashboard_dir))

class Root(object):
    @cherrypy.expose
    def index(request):
        tmpl = env.get_template('templates/index.html')
        return tmpl.render()
    
    @cherrypy.expose
    def hosts(request):
        tmpl = env.get_template('templates/hosts.html')
        return tmpl.render()

    @cherrypy.expose
    def profiles(request):
        tmpl = env.get_template('templates/profiles.html')
        return tmpl.render()

    @cherrypy.expose
    def overview(request):
        tmpl = env.get_template('templates/overview.html')
        return tmpl.render()

    @cherrypy.expose
    def svnlogs(request):
        tmpl = env.get_template('templates/svnlogs.html')
        return tmpl.render()

    @cherrypy.expose
    def stats(request):
        tmpl = env.get_template('templates/stats.html')
        return tmpl.render()
    
    @cherrypy.expose
    def personalities(request):
        tmpl = env.get_template('templates/personalities.html')
        return tmpl.render()
    
    @cherrypy.expose
    def az(request):
        tmpl = env.get_template('templates/az.html')
        return tmpl.render()

rootconf = {
    '/assets': {
        'tools.staticdir.on': True,
        'tools.staticdir.dir': dashboard_dir + '/assets'
    }
}

cherrypy.tree.mount(Root(), "/", rootconf)
application = cherrypy.tree
