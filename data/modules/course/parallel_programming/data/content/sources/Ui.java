public class UI {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		ArrayList<Clone> allClones = new ArrayList<Clone>();

		for (int i = 0; i < 10; i++) {
			allClones.add(new Clone(i));
			new Thread(allClones.get(i)).start();

		}
		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {

			e.printStackTrace();
		}

		for(int i=0; i<allClones.size(); i++){
			alleClones.get(i).shutdown();
		}
	}

}