<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login_Form.aspx.cs" Inherits="WebApplication14.Login_Form" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <asp:Label ID="Label1" runat="server" Text="Username"></asp:Label>
&nbsp;&nbsp;&nbsp;
            <asp:TextBox ID="txt_Username" runat="server"></asp:TextBox>
            <br />
            <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <br />
            <asp:Label ID="Label2" runat="server" Text="Password"></asp:Label>
&nbsp;&nbsp;&nbsp;
            <asp:TextBox ID="txt_Password" runat="server"></asp:TextBox>
            <br />
            <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <asp:Label ID="Label3" runat="server" ForeColor="Red" Text="Incorrect Username or Password" Visible="False"></asp:Label>
            <br />
            <br />
            <asp:Button ID="btn_Login" runat="server" OnClick="Button1_Click" Text="Login" />
            <br />
            <br />
        </div>
    </form>
</body>
</html>
