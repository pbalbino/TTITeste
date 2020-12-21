using System;
using System.Runtime.CompilerServices;
using System.Text;
using System.Web.Mvc;

namespace TTITeste.Controllers
{
    public abstract class BaseController : Controller
    {
        #region Methods

        public void ManageMessageError(Exception ex, [CallerMemberName] string callerMemberName = "")
        {
            var sb = new StringBuilder();
            sb.AppendLine(string.Format("Ocorreu um erro no método {0} do controller {1}.", callerMemberName, GetType().Name));
            sb.AppendLine(string.Format("Erro: {0}.", ex.Message));
            ModelState.AddModelError("error", sb.ToString());
        }

        #endregion
    }
}