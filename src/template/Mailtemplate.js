export const templateMail = (template, mailContent) => {
    switch (template) {
        case 'Verify':
            return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác Nhận Đơn Hàng - BITTIS</title>
      <style>
      body {
        font-family: "Poppins", sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f7f9fc;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background: #edefef;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding: 20px;
        background-color: #1e3a8a;
        color: #ffffff;
        border-radius: 10px 10px 0 0;
        margin-bottom: 20px;
      }
      .header img {
        max-width: 180px;
        height: auto;
      }
      .content {
        padding: 20px;
        color: #333;
      }
      .content h1 {
        color: #1e3a8a;
        font-size: 24px;
        margin-bottom: 20px;
      }
      .content p {
        line-height: 1.6;
        margin-bottom: 20px;
      }
      .btn {
        display: inline-block;
        background-color: #1e3a8a;
        color: #ffffff;
        padding: 12px 25px;
        border-radius: 5px;
        text-decoration: none;
        font-weight: 600;
        font-size: 16px;
        margin-top: 10px;
        transition: background-color 0.3s ease;
      }
      .btn:hover {
        background-color: #123b7b;
      }
      .background {
        background-color: #f7f9fc;
        border-radius: 10px;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 14px;
        color: #777;
        border-top: 1px solid #e0e0e0;
      }
      .footer p {
        margin: 0;
      }
    </style>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4;">
    <div style="max-width: 700px; margin: 20px auto; background-color: white; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #303030, #ff5f17); color: white; padding: 30px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
            <img src="https://res.cloudinary.com/dbbontzg4/image/upload/v1741668454/bitisLogo-removebg-preview_vdkw3y.png" alt="BITTIS Logo" style="max-height: 80px; margin-bottom: 15px;">
            <h1 style="margin: 0; font-size: 24px;">${mailContent?.content?.title}</h1>
        </div>

        <div style="padding: 30px;">
            <h2 style="color: #2c3e50;">Xin chào, ${mailContent?.content?.email}!</h2>

            <p style="color: #333;">${mailContent.content.description}</p>
            <div style="background-color: #f9f9f9; border-left: 4px solid #303030; padding: 15px; margin: 20px 0;">
               <a style="color: white" href="${mailContent?.link?.linkHerf}" class="btn"
            >${mailContent?.link?.linkName}</a
          >
            </div>
            ${
                mailContent.content.warning
                    ? `
                <div style="background-color: #ffdddd; border-left: 4px solid #f44336; color: #d32f2f; padding: 15px; margin-top: 20px;">
                    <p>${mailContent.content.warning}</p>
                </div>
            `
                    : ''
            }
        </div>

        <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center;">
            <p>© 2025 BITTIS. Đã đăng ký bản quyền</p>
            <p>Trải nghiệm mua sắm hoàn hảo</p>
        </div>
    </div>
</body>
</html>`;
        case 'ResetPassword':
            return `
                  <!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Khôi phục mật khẩu - BITTIS</title>
      <style>
      body {
        font-family: "Poppins", sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f7f9fc;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background: #edefef;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding: 20px;
        background-color: #1e3a8a;
        color: #ffffff;
        border-radius: 10px 10px 0 0;
        margin-bottom: 20px;
      }
      .header img {
        max-width: 180px;
        height: auto;
      }
      .content {
        padding: 20px;
        color: #333;
      }
      .content h1 {
        color: #1e3a8a;
        font-size: 24px;
        margin-bottom: 20px;
      }
      .content p {
        line-height: 1.6;
        margin-bottom: 20px;
      }
      .btn {
        display: inline-block;
        background-color: #1e3a8a;
        color: #ffffff;
        padding: 12px 25px;
        border-radius: 5px;
        text-decoration: none;
        font-weight: 600;
        font-size: 16px;
        margin-top: 10px;
        transition: background-color 0.3s ease;
      }
      .btn:hover {
        background-color: #123b7b;
      }
      .background {
        background-color: #f7f9fc;
        border-radius: 10px;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 14px;
        color: #777;
        border-top: 1px solid #e0e0e0;
      }
      .footer p {
        margin: 0;
      }
    </style>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4;">
    <div style="max-width: 700px; margin: 20px auto; background-color: white; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #303030, #ff5f17); color: white; padding: 30px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
            <img src="https://res.cloudinary.com/dbbontzg4/image/upload/v1741668454/bitisLogo-removebg-preview_vdkw3y.png" alt="BITTIS Logo" style="max-height: 80px; margin-bottom: 15px;">
            <h1 style="margin: 0; font-size: 24px;">${mailContent?.content?.title}</h1>
        </div>

        <div style="padding: 30px;">
            <h2 style="color: #2c3e50;">Xin chào, ${mailContent?.content?.email}!</h2>

            <p style="color: #333;">${mailContent.content.description}</p>
            <div style="background-color: #f9f9f9; border-left: 4px solid #303030; padding: 15px; margin: 20px 0;">
               <a target='_blank' style="color: white" href="${mailContent?.link?.linkHerf}" class="btn"
            >${mailContent?.link?.linkName}</a
          >
            </div>
            ${
                mailContent.content.warning
                    ? `
                <div style="background-color: #ffdddd; border-left: 4px solid #f44336; color: #d32f2f; padding: 15px; margin-top: 20px;">
                    <p>${mailContent.content.warning}</p>
                </div>
            `
                    : ''
            }
        </div>

        <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center;">
            <p>© 2025 BITTIS. Đã đăng ký bản quyền</p>
            <p>Trải nghiệm mua sắm hoàn hảo</p>
        </div>
    </div>
</body>
</html>`;
        case 'UpdateStatusOrder':
            return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác Nhận Đơn Hàng - BITTIS</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4;">
    <div style="max-width: 700px; margin: 20px auto; background-color: white; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #303030, #ff5f17); color: white; padding: 30px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
            <img src="https://res.cloudinary.com/dbbontzg4/image/upload/v1741668454/bitisLogo-removebg-preview_vdkw3y.png" alt="BITTIS Logo" style="max-height: 80px; margin-bottom: 15px;">
            <h1 style="margin: 0; font-size: 24px;">${mailContent?.content?.title || 'Xác Nhận Đơn Hàng'}</h1>
        </div>

        <div style="padding: 30px;">
            <h2 style="color: #2c3e50;">Xin chào, ${mailContent?.user?.name}!</h2>

            <p style="color: #333;">${mailContent.content.description}</p>

            <div style="background-color: #f9f9f9; border-left: 4px solid #303030; padding: 15px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #2c3e50;">Thông Tin Giao Hàng</h3>
                <p><strong>Tên người nhận:</strong> ${mailContent?.user?.name}</p>
                <p><strong>Số điện thoại:</strong> ${mailContent?.user?.phone}</p>
                <p><strong>Email:</strong> ${mailContent?.user?.email}</p>
                <p><strong>Địa chỉ giao hàng:</strong> ${mailContent?.user?.address}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="background-color: #303030; color: white;">
                        <th style="padding: 10px; text-align: left;">Sản Phẩm</th>
                        <th style="padding: 10px; text-align: left;">Tên</th>
                        <th style="padding: 10px; text-align: left;">SL</th>
                        <th style="padding: 10px; text-align: left;">Size</th>
                        <th style="padding: 10px; text-align: left;">Màu</th>
                        <th style="padding: 10px; text-align: left;">Giá</th>
                    </tr>
                </thead>
                <tbody>
                    ${mailContent.product?.items
                        .map(
                            (product) => `
                        <tr style="border-bottom: 1px solid #ecf0f1;">
                            <td style="padding: 10px;"><img src="${product.image}" alt="${product.name}" style="max-width: 70px; border-radius: 5px;"></td>
                            <td style="padding: 10px;">${product.name}</td>
                            <td style="padding: 10px;">${product.quantity}</td>
                            <td style="padding: 10px;">${product.size}</td>
                            <td style="padding: 10px;">${product.color}</td>
                            <td style="padding: 10px;">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</td>
                        </tr>
                    `,
                        )
                        .join('')}
                </tbody>
            </table>
   <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; display: flex; align-items: center; justify-content: space-between;">
    <div style="display: flex; align-items: center;">
        <div>
            <strong style="color: #2c3e50; font-size: 16px;">Cảm ơn bạn đã tin tưởng!</strong>
            <p style="color: #7f8c8d; margin: 5px 0 0; font-size: 14px;">Chúng tôi luôn nỗ lực mang đến trải nghiệm tốt nhất</p>
        </div>
    </div>
    <div style="text-align: right;">
        <p style="margin: 0; color: #34495e; font-size: 14px;">
            <strong>Phí Giao Hàng:</strong>
            <span style="color: #303030; font-weight: bold;">
                ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(mailContent.product?.shippingfee || 0)}
            </span>
        </p>
        <p style="margin: 5px 0 0; color: #34495e; font-size: 16px;">
            <strong>Tổng Tiền:</strong>
            <span style="color: #e74c3c; font-weight: bold; font-size: 18px;">
                ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(mailContent.product?.totalPrice || 0)}
            </span>
        </p>
    </div>
</div>
            <a href="${mailContent?.link?.linkHerf}" style="display: inline-block; background-color: #303030; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin-top: 15px; text-align: center;">Xem Chi Tiết Đơn Hàng</a>

            ${
                mailContent.content.warning
                    ? `
                <div style="background-color: #ffdddd; border-left: 4px solid #f44336; color: #d32f2f; padding: 15px; margin-top: 20px;">
                    <p>${mailContent.content.warning}</p>
                </div>
            `
                    : ''
            }
        </div>

        <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center;">
            <p>© 2025 BITTIS. Đã đăng ký bản quyền</p>
            <p>Trải nghiệm mua sắm hoàn hảo</p>
        </div>
    </div>
</body>
</html>
`;
        case 'ResetPassword':
            return `
                  <!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Khôi phục mật khẩu - Bitistore</title>
      <style>
      body {
        font-family: "Poppins", sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f7f9fc;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background: #edefef;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding: 20px;
        background-color: #1e3a8a;
        color: #ffffff;
        border-radius: 10px 10px 0 0;
        margin-bottom: 20px;
      }
      .header img {
        max-width: 180px;
        height: auto;
      }
      .content {
        padding: 20px;
        color: #333;
      }
      .content h1 {
        color: #1e3a8a;
        font-size: 24px;
        margin-bottom: 20px;
      }
      .content p {
        line-height: 1.6;
        margin-bottom: 20px;
      }
      .btn {
        display: inline-block;
        background-color: #1e3a8a;
        color: #ffffff;
        padding: 12px 25px;
        border-radius: 5px;
        text-decoration: none;
        font-weight: 600;
        font-size: 16px;
        margin-top: 10px;
        transition: background-color 0.3s ease;
      }
      .btn:hover {
        background-color: #123b7b;
      }
      .background {
        background-color: #f7f9fc;
        border-radius: 10px;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 14px;
        color: #777;
        border-top: 1px solid #e0e0e0;
      }
      .footer p {
        margin: 0;
      }
    </style>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4;">
    <div style="max-width: 700px; margin: 20px auto; background-color: white; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #303030, #ff5f17); color: white; padding: 30px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
            <img src="https://res.cloudinary.com/dbbontzg4/image/upload/v1741668454/bitisLogo-removebg-preview_vdkw3y.png" alt="Bitistore Logo" style="max-height: 100px; margin-bottom: 15px;">
            <h1 style="margin: 0; font-size: 24px;">${mailContent?.content?.title}</h1>
        </div>
        
        <div style="padding: 30px;">
            <h2 style="color: #2c3e50;">Xin chào, ${mailContent?.content?.email}!</h2>
            
            <p style="color: #333;">${mailContent.content.description}</p>
            <div style="background-color: #f9f9f9; border-left: 4px solid #303030; padding: 15px; margin: 20px 0;">
               <a target='_blank' style="color: white" href="${mailContent?.link?.linkHerf}" class="btn"
            >${mailContent?.link?.linkName}</a
          >
            </div>
            ${
                mailContent.content.warning
                    ? `
                <div style="background-color: #ffdddd; border-left: 4px solid #f44336; color: #d32f2f; padding: 15px; margin-top: 20px;">
                    <p>${mailContent.content.warning}</p>
                </div>
            `
                    : ''
            }
        </div>

        <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center;">
            <p>© 2025 Bitstore. Đã đăng ký bản quyền</p>
            <p>Trải nghiệm mua sắm hoàn hảo</p>
        </div>
    </div>
</body>
</html>`;
        default:
            return 'none';
    }
};
