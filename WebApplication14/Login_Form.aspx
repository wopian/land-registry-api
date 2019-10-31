<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login_Form.aspx.cs" Inherits="WebApplication14.Login_Form" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div">
        <asp:Label ID="Label1" runat="server" Text="Username" BorderStyle="None"></asp:Label>

            <asp:TextBox ID="txt_Username" runat="server" ForeColor="Black"></asp:TextBox>
            <br />
            <br />
            <asp:Label ID="Label2" runat="server" Text="Password" BorderStyle="None"></asp:Label>

            <asp:TextBox ID="txt_Password" runat="server" TextMode="Password" ForeColor="Black"></asp:TextBox>
            <br />
            <br />
            <br />
            <asp:Button ID="btn_Login" runat="server" OnClick="Button1_Click" Text="Login" Width="111px" />
            <br />
            <br />
            <br />
        </div>
    </form>
</body>
</html>
