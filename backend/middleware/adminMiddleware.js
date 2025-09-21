
function restrictAdminIP(req, res, next) {
  const allowedIP = process.env.ADMIN_IP; 
  let requestIP = req.ip;

  // Handle IPv4-mapped IPv6 (::ffff:192.168.1.12 -> 192.168.1.12)
  if (requestIP.startsWith("::ffff:")) {
    requestIP = requestIP.split("::ffff:")[1];
  }
  
  console.log("request IP:", requestIP); 

  if (requestIP !== allowedIP) {
    return res.status(403).json({ message: "Access denied" });
  }

  console.log("Admin logged in by IP: ", requestIP) 

  next();
}

export { restrictAdminIP };

