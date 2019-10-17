using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace WebApplication14
{
    public partial class Login_Form : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void Button1_Click(object sender, EventArgs e)
        {
            if(txt_Username.Text=="Admin" && txt_Password.Text == "Admin")
            {
                Response.Redirect("Welcome_Form.aspx");
            }
            else
            {
                Label2.Visible = true;
            }
        }
    }
}