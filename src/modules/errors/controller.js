export function showError(req, res) {
	const { status } = req.params;

	res.status(Number(status)).render(`errors/${status}`);
}